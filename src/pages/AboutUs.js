import { Element, scroller } from "react-scroll";
import { Link } from 'react-router-dom';

function AboutUs() {
  const scrollToFeatures = () => {
    scroller.scrollTo("features", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -80 // Adjust this offset value as needed to align with your page layout
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-white text-6xl font-bold mt-20 mb-20 text-center">
          The Team
        </div>
        <div className="text-white text-xl max-w-3xl mb-20 text-center">
        We are a team of UCLA students who have come together to create this client-server application! We hope you enjoy using our app and provide feeback!
        </div>

        <div className="flex space-x-4 mb-12">
          <Link to="/Home" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-xl">
            Home
          </Link>
          <Link to="/LoginPage" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-xl">
            Login Page
          </Link>
        </div>
        <button
          className="text-white text-2xl mt-8 bg-gray-900 bg-opacity-80 text-opacity-90 px-8 py-3 rounded border border-white shadow-xl focus:outline-none hover:bg-gray-800"
          onClick={scrollToFeatures}
        >
          Our Members
        </button>
      </div>

      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Rahul M</h2>
            <div className="flex items-center justify-center mb-4">
              <img src="TheGaot.png" alt="Expense Management" className="max-w-full max-h-48" />
            </div>
            <p className="text-gray-800">
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3

           </p>
          </div>
        </Element>
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Vishnu M</h2>
            <div className="flex items-center justify-center mb-4">
              <img src="image2.jpg" alt="Payment Splitting" className="max-w-full max-h-48" />
            </div>
            <p className="text-gray-800">
            Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
            </p>
          </div>
        </Element>
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Rahul K</h2>
            <div className="flex items-center justify-center mb-4">
              <img src="image3.jpg" alt="Trip Planning" className="max-w-full max-h-48" />
            </div>
            <p className="text-gray-800">
            Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
Writre a descriptiong a aoubeo;iutv weriutvh wpuo chpwuwptruighv ihblvkukuvkqpuorfhqp3
            </p>
          </div>
        </Element>
      </div>
    </div>
  );
}

export default AboutUs;