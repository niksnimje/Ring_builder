import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { CgArrowLongRight } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '../../../redux/slice/favourite/removeFav';
import { addToWishlist } from '../../../redux/slice/favourite/addToFavourite';
import { addToCart } from '../../../redux/slice/cart/addToCart';

export default function AllDiamondData() {
    const [animating, setAnimating] = useState({});
    const [showAccountBox, setShowAccountBox] = useState(false);
    // const location = useLocation();
    // const diaData = location.state?.diaData || [];

    const location = useLocation();
    const { diaData, currentPage, onPageChange, handlePreviousPage, handleNextPage } = location.state || {};

    const dispatch = useDispatch();
    const favItems = useSelector((state) => state.favItems.favItems);

    const [favItemIds, setFavItemIds] = useState([]);

    // Initialize favorite items
    useEffect(() => {
        if (favItems && favItems.data) {
            const ids = favItems.data.map((item) => item.id);
            setFavItemIds(ids);
        }
    }, [favItems]);

    const isLoggedIn = !!localStorage.getItem("sessionActive");
    const user_id = localStorage.getItem("user_id");

    // Handle favorite button click
    const handleFavClick = (item) => {
        if (!isLoggedIn) {
            setShowAccountBox(true);
            return;
        }

        const isProductInFavs = favItems?.data?.some(
            (favItem) => favItem.data_id.id === item.id && favItem.type === "diamond"
        );

        if (isProductInFavs) {
            dispatch(removeFromWishlist(favItemIds));
        } else {
            dispatch(
                addToWishlist({
                    data_id: item.id,
                    user_id,
                    type: "diamond",
                })
            );
        }

        // Animation handling
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

    // Handle "Add to Cart" functionality
    const handleAddToCart = (item) => {
        if (!isLoggedIn) {
            setShowAccountBox(true);
            return;
        }
        dispatch(
            addToCart({
                productId: item.id,
                quantity: 1,
                type: "diamond",
            })
        );
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
        <div className="container mx-auto p-6">

            <div className="flex items-center">
                <Link to="/diamond" className="text-black">
                    <h2>Back</h2>
                </Link>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">All Diamond Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {diaData && diaData.length > 0 ? (
                    diaData.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-4 shadow-sm relative"
                        >
                            {/* Product Image */}
                            <div className="relative">
                                <Link to={`/diamond/${item.id}`}>
                                    <img
                                        className="w-full h-auto object-cover rounded-md"
                                        src={item["Image Link"] || "/diamondimg/No Image Found 346x346.jpg"}
                                        alt={item.Shape}
                                    />
                                </Link>

                                {/* Favorite Button */}
                                <div
                                    onClick={() => handleFavClick(item)}
                                    className={`absolute top-2 right-3 text-[27px] cursor-pointer ${animating[item.id] ? "heart-fling" : ""}`}
                                >
                                    {favItems?.data?.some((favItem) => favItem.data_id.id === item.id) ? (
                                        <IoMdHeart className="heart-filled text-red-500" />
                                    ) : (
                                        <IoMdHeartEmpty className="heart-empty" />
                                    )}
                                </div>

                            </div>

                            {/* Product Details */}
                            <div className="mt-4 text-left">
                                <span>ID:{item.id}</span>
                                <p className="text-lg font-semibold">
                                    {item.Shape} {item.Weight}ct {item.Color} {item.Clarity}
                                </p>
                                <p>
                                    <strong>Stock:</strong> {item["Stock #"]}
                                </p>
                                <p className="text-gray-800 mt-1">
                                    Total Price:
                                    <strong>${formatTotalPrice(item["Total Price"])}</strong>
                                </p>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="flex items-center gap-2 border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-[#BCABA1] hover:text-white hover:border-white transition"
                                >
                                    Add to Cart <CgArrowLongRight />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Loading products...</p>
                )}
            </div>
        </div>
    );
}
