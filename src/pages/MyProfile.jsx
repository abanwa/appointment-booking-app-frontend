import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function MyProfile() {
  const { token, backendUrl, loadUserProfileData, userData, setUserData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      // if we have set an image, the image will be appended to the formData
      image && formData.append("image", image);
      console.log("userData ; ", userData);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        console.log("updated data: ", data?.updatedData);
        toast.success(data?.message);
        setUserData(data?.updatedData);
        setIsEdit(false);
        setImage(false);
      } else {
        console.log("profile could not be updated");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in MyProfile.jsx in updateUserProfileData : ", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;
  console.log("imgData: ", userData?.image);
  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : userData?.image}
              className="w-36 rounded opacity-75"
              alt="userData_image"
            />
            <img
              src={image ? "" : assets.upload_icon}
              className="w-10 absolute bottom-12 right-12"
              alt=""
            />
          </div>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </label>
      ) : (
        <img src={userData.image} className="w-36 rounded" alt="user_image" />
      )}

      {isEdit ? (
        <input
          type="text"
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 outline-none"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 max-w-52"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                type="text"
                className="bg-gray-50"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value }
                  }))
                }
                value={userData.address.line1}
              />
              <br />
              <input
                type="text"
                className="bg-gray-50"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value }
                  }))
                }
                value={userData.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              className="max-w-28 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            disabled={loading}
            onClick={updateUserProfileData}
          >
            {loading ? "Saving Info.." : "Save information"}
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
