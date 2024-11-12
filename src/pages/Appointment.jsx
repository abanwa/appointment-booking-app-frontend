import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

function Appointment() {
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  // const fetchDocInfo = async () => {
  //   const docData = doctors.find((doc) => doc._id === docId);
  //   setDocInfo(docData);
  // };

  const fetchDocInfo = useCallback(async () => {
    const docData = doctors.find((doc) => doc._id === docId);
    setDocInfo(docData);
  }, [docId, doctors]);

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    // we will calculate 7 days from today
    for (let i = 0; i < 7; i++) {
      // console.log("i is : ", i);
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      // if currentdate is the same as today
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // it means we are in future date
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        // if any of the slotDate has been booked, we will not push that sloatDate and time into the timeSLots array
        // if any of this condition is false, we will say it's true
        // we check if the doctors booked slot contains the current date and also if the current date includes the time
        // that is if the doctors has been booed in that date and time
        // if the both condition is true, we will not add the date and time to the timeSlot array otherwise, we will add it to the timeSlot array
        const isSlotAvailable =
          docInfo?.slots_booked[slotDate] &&
          docInfo?.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        // add slot to array
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        // we will increment the current time by 30 mins
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      // when we log in, we will be automatically be redirected to this page
      return navigate("/login", { state: { from: location } });
    }

    if (!slotTime) {
      toast.warn("Select booking Time");
      return;
    }
    try {
      setLoading(true);
      const date = docSlots[slotIndex][0].datetime;

      // console.log("date:", date);
      // console.log("slotTime:", slotTime);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data?.success) {
        console.log("Appointment booked successfully");
        toast.success(data?.message);
        // we will get the doctors data so that we will update the doctors
        await getDoctorsData();
        navigate("/my-appointments");
      } else {
        console.log("Appointment could not be booked");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error from Appointment.jsx in bookAppointment : ", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [fetchDocInfo]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log("docSlots : ", docSlots);
  }, [docSlots]);

  console.log("DocInfo in Appointment.jsx : ", docInfo);

  if (!docInfo) return null;

  return (
    <div>
      {/* --- Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            src={docInfo?.image}
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            alt="doctImage"
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* -- doc Info: name, degree, experience */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo?.name}{" "}
            <img
              src={assets.verified_icon}
              className="w-5"
              alt="verified_icon"
            />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo?.degree} - {docInfo?.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo?.experience}
            </button>
          </div>

          {/* --- Doctor About --- */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="info_icon" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo?.about}
            </p>
          </div>

          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currencySymbol}
              {docInfo?.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ----  Bookins Slot --- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-gray-200"
                }`}
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length > 0 &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
                key={index}
              >
                {item?.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book an appointment"}
        </button>
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
}

export default Appointment;
