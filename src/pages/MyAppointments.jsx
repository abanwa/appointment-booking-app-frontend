import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function MyAppointments() {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);

  const navigate = useNavigate();

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("_");
    return `${day} ${months[Number(month)]}, ${year}`;
  };

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });

      if (data?.success) {
        console.log("appointments fetched");
        // the reserver will make the latest appointment to come first
        setAppointments(data?.appointments.reverse());
      } else {
        console.log("failed to fetch appointments");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log(
        "Error from MyAppointment.jsx in getUserAppointments : ",
        err
      );
      toast.error(err?.message);
    }
  }, [backendUrl, token]);

  // cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data?.success) {
        console.log("Appointment cancelled successfully");
        toast.success(data?.message);
        // get the updated appointments
        await getUserAppointments();
        // get the updated doctors because of the slot time
        await getDoctorsData();
      } else {
        console.log("Appointment could not be cancelled");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error from MyAppointment.jsx in cancelAppointment", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  // payment init
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("response: ", response);
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (data?.success) {
            await getUserAppointments();
            navigate("/my-appointments");
          } else {
            console.log("razor payment verification failed");
            toast.error(data?.message);
          }
        } catch (err) {
          console.log("Error in handler initPay in  MyAppointments : ", err);
          toast.error(err?.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // make payment
  const appointmentRazorpay = async (appointmentId) => {
    try {
      setLoadingPay(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data?.success) {
        initPay(data?.order);
        console.log("Payment successful");
        console.log("order : ", data?.order);
        toast.success(data?.message);
      } else {
        console.log("Payment failed");
        toast.success(data?.message);
      }
    } catch (err) {
      console.log("Error appointmentRazorpay in Myappointment.jsx : ", err);
      toast.error(err?.message);
    } finally {
      setLoadingPay(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [getUserAppointments, token]);

  if (!appointments) return null;
  console.log(appointments);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>
      <div>
        {appointments.length > 0 &&
          appointments.map((item) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={item?._id}
            >
              <div>
                <img
                  src={item.docData?.image}
                  className="w-32 bg-indigo-50"
                  alt={`app_img_${item?._id}`}
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData?.name}
                </p>
                <p>{item.docData?.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData?.address?.line1}</p>
                <p className="text-xs">{item.docData?.address?.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!item?.cancelled && item?.payment && !item?.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                    Paid
                  </button>
                )}
                {!item?.cancelled && !item?.payment && !item?.isCompleted && (
                  <button
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    onClick={() => appointmentRazorpay(item?._id)}
                  >
                    {loadingPay ? "Paying..." : "Pay Online"}
                  </button>
                )}
                {!item?.cancelled && !item?.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item?._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Cancelling..." : "Cancel appointment"}
                  </button>
                )}
                {item?.cancelled && !item?.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
                {item?.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MyAppointments;
