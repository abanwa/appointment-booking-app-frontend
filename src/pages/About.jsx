import { assets } from "../assets/assets";

function About() {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          src={assets.about_image}
          className="w-full md:max-w-[360px]"
          alt="about_image"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
            accusantium atque autem iure minima quis magnam fuga deserunt modi
            vitae! Laboriosam magnam dolorum illo doloribus est minus atque
            aliquid excepturi.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
            incidunt, eligendi pariatur facilis corrupti obcaecati commodi
            laudantium facere porro voluptatum deleniti, tenetur vitae provident
            animi temporibus sapiente voluptate maiores ipsum neque! Neque
            consequatur ea, molestias ullam exercitationem sunt sint laudantium
            dolor placeat laborum.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quos
            qui enim nostrum quidem, cupiditate natus fugiat exercitationem
            veritatis voluptas recusandae. Soluta ad non blanditiis!
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficiency:</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            aspernatur consectetur quia iste minus rerum.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
            laudantium atque quidem!
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization:</b>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima,
            expedita.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
