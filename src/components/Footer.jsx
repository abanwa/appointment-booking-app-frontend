import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* --left section */}
        <div>
          <img src={assets.logo} className="mb-5 w-40" alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            ducimus, quis voluptatibus eveniet numquam molestias illum
            laboriosam nam expedita quod inventore, placeat earum delectus,
            explicabo unde facilis voluptatem possimus nihil quaerat minus fuga
            sed veniam.
          </p>
        </div>
        {/* --middle section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* --right section */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>abanwachinaza@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* --- Copy Right Text ---- */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright {new Date().getFullYear()} @ Appointment Booking App - All
          Right Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
