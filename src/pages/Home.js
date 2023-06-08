import React from 'react';
import { Link } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import logo from './darklogo.jpg'
function Home() {
  const scrollToFeatures = () => {
    scroller.scrollTo('features', {
      duration: 2000,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-white text-6xl font-bold mt-20 mb-20 text-center">
          SplitPay
        </div>
        <div className="text-white text-xl max-w-3xl mb-20 text-center">
          SplitPay is an innovative app that simplifies group expenses and trip planning. Whether you're organizing a vacation, splitting bills with friends, or managing shared expenses, SplitPay has got you covered. With our efficient greedy algorithm, the app intelligently calculates and splits payments, ensuring everyone pays their fair share.
        </div>

        <div className="flex space-x-4 mb-12">
          <Link to="/AboutUs" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-xl">
            About Us
          </Link>
          <Link to="/LoginPage" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-xl">
            Login Page
          </Link>
        </div>
        <button
        className="text-white text-2xl mt-8 bg-gray-900 bg-opacity-80 text-opacity-90 px-8 py-3 rounded border border-white shadow-xl focus:outline-none hover:bg-gray-800"
        onClick={scrollToFeatures}
        >
        Learn More
        </button>



      </div>

      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Expense Management Made Easy</h2>
            <p className="text-gray-800">
              SplitPay provides a user-friendly interface for creating and managing group expenses. Whether you're sharing costs for a road trip, a dinner outing, or a weekend getaway, our app streamlines the process. Simply create a group, add participants, and enter the expenses. SplitPay will automatically calculate each person's share and keep track of who owes what.
            </p>
          </div>
        </Element>
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Efficient Payment Splitting</h2>
            <p className="text-gray-800">
              SplitPay employs an efficient greedy algorithm to distribute expenses among group members. It optimizes the payment splitting process, minimizing the number of transactions and ensuring fairness. With SplitPay, you can say goodbye to complicated calculations and disputes over money.
            </p>
          </div>
        </Element>
        <Element name="features">
          <div className="bg-white h-90vh rounded-lg shadow-lg p-8 mx-4 mb-8">
            <h2 className="text-3xl font-bold mb-4">Seamless Trip Planning</h2>
            <p className="text-gray-800">
              Planning a trip with friends? SplitPay has got you covered. Our app allows you to manage shared expenses and keep track of all financial transactions during the trip. Whether it's booking accommodations, transportation, or activities, SplitPay helps you organize and split costs effortlessly.
            </p>
          </div>
        </Element>
      </div>


    </div>
  );
}

export default Home;
