import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoEarthOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { IoIosMailOpen, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { SlEnvolopeLetter } from "react-icons/sl";
import "../../../App.css";
import { useDispatch, useSelector } from 'react-redux';
import AccountBox from '../../../common/Header/AccountBox';
import { removeFromCart } from '../../../redux/slice/cart/removeCart';
import { addToWishlist } from '../../../redux/slice/favourite/addToFavourite';
import { removeFromFav, removeFromWishlist } from '../../../redux/slice/favourite/removeFav';
import MakeAnAppointment from '../../MakeAppointment/MakeAnAppointment';
import { addToCart } from '../../../redux/slice/cart/addToCart';
import { FaPlayCircle } from "react-icons/fa";
import ShareList from '../../ShareButton/ShareList';

export default function AddToDiamondPage() {
    const [diamondData, setDiamondData] = useState([]);
    const [animating, setAnimating] = useState({});
    const { id } = useParams();
    const diamondId = parseInt(id);
    const sliderRef = useRef(null); // Create a ref for the slider
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("sessionActive")); // Track login state
    const [showAccountBox, setShowAccountBox] = useState(false);
    const user_id = localStorage.getItem("user_id");
    const [media, setMedia] = useState({
        images: [],
        video: null,
    });
    const dispatch = useDispatch();
    const [isVideoPlaying, setIsVideoPlaying] = useState(false); // State to track video playback
    const favItems = useSelector((state) => state.favItems.favItems);
    const [favItemIds, setFavItemIds] = useState([]);
    useEffect(() => {
        if (favItems && favItems.data) {
            const ids = favItems.data.map((v) => v.id);
            setFavItemIds(ids);
        }
    }, [favItems]);


    useEffect(() => {
        fetchDiamondData();
    }, []);

    const fetchDiamondData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_DEV_URL}/users/get-data-byid/${diamondId}?type=diamond`);

            if (response.ok) {
                const diamondType = await response.json();
                setDiamondData(diamondType.results);
            } else {
                console.error("Failed to fetch diamond data:", response.statusText);
            }
        } catch (error) {
            console.log("Error", error);
        }
    }
    const selectedDiamond = diamondData.find(diamond => diamond.id === diamondId);

    useEffect(() => {
        if (selectedDiamond) {
            const imageLinks = [
                selectedDiamond["Image Link"] || "/diamondimg/No Image Found 346x346.jpg",
                selectedDiamond["Image Link"] || "/diamondimg/No Image Found 346x346.jpg",
                "/diamondimg/360diamond.png",
            ];
            const videoLink = selectedDiamond["Video Link"];
            setMedia({
                images: imageLinks,
                video: videoLink,
            });
        }
    }, [selectedDiamond]);



    const handleFavoriteToggle = (item) => {
        if (!isLoggedIn) {
            setShowAccountBox(true);
            return;
        }

        const isProductInFavs = favItems.data?.some((favItem) => favItem.data_id.id === item.id && favItem.type === "diamond");
        if (isProductInFavs) {
            dispatch(removeFromWishlist(favItemIds));
        } else {
            dispatch(addToWishlist({
                data_id: diamondId,
                user_id: user_id,
                type: "diamond",
            }));
        }
        setAnimating((prev) => ({
            ...prev,
            [item.id]: true,
        }));
        setTimeout(() => {
            setAnimating((prev) => ({
                ...prev,
                [item.id]: false,
            }));
        }, 500);
    };

    const handleAddToDiamondCart = () => {
        if (!isLoggedIn) {
            setShowAccountBox(true);
            return;
        } else {
            dispatch(addToCart({
                productId: diamondId,
                quantity: 1,
                type: "diamond",
            }));
        }
    };

    const settings = {
        customPaging: (i) => (
            <div className="hidden sm:w-12 sm:h-12 sm:block md:w-16 md:h-16 lg:w-20 lg:h-20">
                <img src={media.images[i]} className="object-cover w-full h-full" alt={`Thumbnail ${i}`} />
            </div>
        ),
        dots: true,
        dotsClass: "slick-dots custom-slick-dots",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    const formatTotalPrice = (value) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) return "";
        const [integerPart, decimalPart] = parsedValue.toString().split(".");
        if (!decimalPart) return integerPart;
        const truncatedDecimal = decimalPart.slice(0, decimalPart.length > 1 ? 2 : 1);
        return `${integerPart}.${truncatedDecimal}`;
    }


    return (
        <section className="container mx-auto h-auto px-4 pt-10 pb-10">
            <div className="mt-4 mb-4">
                <div className="flex items-center">
                    <Link to="/" className="text-black pr-4">Home</Link>
                    <div className="w-px h-6 bg-black mr-4"></div>
                    <Link to="/diamond" className="text-black">Search Lab Grown Diamonds</Link>
                </div>
                <div className="flex flex-col lg:flex-row mt-10 mb-20 diamond-arrow">
                    <div className="lg:w-1/2 w-full relative">
                        <Slider {...settings}>
                            {media.images.map((image, index, item) => (
                                <div key={index} className="flex justify-center relative">
                                    {media.video && index === 0 && !isVideoPlaying ? (
                                        <>
                                            <img
                                                src={image}
                                                className="w-full h-[400px] lg:h-[550px] object-contain rounded-[15px] cursor-pointer"
                                                alt="Diamond Video Thumbnail"
                                                onClick={() => setIsVideoPlaying(true)} // Start video playback on click
                                            />
                                            <FaPlayCircle
                                                className="absolute top-1/2 left-1/2 text-white text-[50px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                                onClick={() => setIsVideoPlaying(true)} // Start video playback on icon click
                                            />
                                        </>
                                    ) : index === 0 && isVideoPlaying ? (
                                        <iframe
                                            src={media.video}
                                            className="w-full h-[400px] lg:h-[550px] object-contain rounded-[15px]"
                                            title="Diamond Video"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            frameBorder="0"
                                        />
                                    ) : (
                                        <img
                                            src={image}
                                            className="w-full h-[400px] lg:h-[550px] object-contain rounded-[15px]"
                                            alt={`Diamond Image ${index + 1}`}
                                        />
                                    )}
                                    <div
                                        onClick={() => handleFavoriteToggle(selectedDiamond)}
                                        className={`absolute top-2 right-3 text-[27px] cursor-pointer ${animating[selectedDiamond?.id] ? "heart-fling" : ""}`}
                                    >
                                        {favItems.data?.some((favItem) => favItem.data_id.id === selectedDiamond?.id && favItem.type === "diamond") ? (
                                            <IoMdHeart className="heart-filled" />
                                        ) : (
                                            <IoMdHeartEmpty className="text-[#000]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Slider>
                        {showAccountBox && (
                            <AccountBox
                                onClose={() => setShowAccountBox(false)} // Close AccountBox
                                setAccountBoxVisible={setShowAccountBox}
                                setFirstName={(name) => console.log("Set First Name:", name)} // Example handler
                                handleLogout={() => console.log("User logged out")} // Example logout handler
                            />
                        )}
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-8 lg:w-1/2 w-full md:pt-12">
                        {selectedDiamond ? (
                            <>
                                <h1 className="text-xl md:text-2xl font-bold">
                                    8.16 Carat Princess Shaped Ideal Cut E-VVS2 IGI Certified Lab Grown Diamond
                                </h1>
                                <p className="text-gray-500 mt-4"><strong>{selectedDiamond["Cut Grade"]} Cut | {selectedDiamond["Color"]} Color | {selectedDiamond["Clarity"]} Clarity</strong></p>

                                <div className="mt-4">
                                    <span className="text-2xl md:text-3xl font-semibold text-black-500">
                                        ${formatTotalPrice(selectedDiamond["Total Price"])}
                                    </span>
                                    <p className="text-gray-500">
                                        Monthly payments available with <a href="#" className="text-blue-500 underline">Affirm</a>
                                    </p>
                                </div>

                                <div className="my-6 flex flex-col sm:flex-row space-x-0 sm:space-x-4">
                                    {/* <button className="border-2 border-black text-black text-xs sm:text-sm md:text-base px-4 py-2 rounded hover:bg-[#BCABA1] hover:text-white hover:border-white transition">
                                        ADD TO RING
                                    </button> */}
                                    <button
                                        className="border-2 border-black text-black text-xs sm:text-sm md:text-base px-4 py-2 rounded hover:bg-[#BCABA1] hover:text-white hover:border-white transition"
                                        onClick={handleAddToDiamondCart}
                                    >
                                        ADD TO BAG
                                    </button>
                                </div>

                                <MakeAnAppointment />

                                <ShareList />
                            </>
                        ) : (
                            <p className="text-lg text-red-500">Diamond not found.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
