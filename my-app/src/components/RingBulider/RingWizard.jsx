import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RingWizard = ({ onComplete , onSkip  }) => {

    const [step, setStep] = useState(1);

    const [selections, setSelections] = useState({
        style: "Solitaire",
        metal: "#E6BE5A",
        shape: "Round",
        weight: 1.0,
    });
    const navigate = useNavigate();

    const nextStep = () => setStep(step + 1);

    const handleFinalize = (weight) => {
        const finalData = { ...selections, weight };
        onComplete(finalData);
    };

    console.log(selections)

    // =====================================
    // STYLE DATA
    // =====================================

    const styles = [
         {
        name: "Solitaire",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
        {
        name: "Pave",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },

    {
        name: "Pave 2",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },

    {
        name: "Unique 1",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
    {
        name: "Unique 2",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
    {
        name: "Unique 3",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
    {
        name: "Unique 4",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
    {
        name: "Unique 5",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
    {
        name: "Unique 6",

        images: {
            yellow: "/assets/ring/gold.png",
            white: "/assets/ring/silver.png",
            rose: "/assets/ring/rose.png",
        },
    },
        // "Pave 2",
        // "Pave 3",
        // "Pave 4",
        // "Pave 5",
        // "Unique",
        // "Unique 2",
        // "Unique 3",
        // "Start from scratch"
    ];

    // =====================================
    // SHAPE DATA WITH PNG
    // =====================================

    const shapes = [
        {
            name: "Round",
            image: "/diamondimg/Round.png",
        },
        {
            name: "Oval",
            image: "/diamondimg/Oval.png",
        },
        {
            name: "Cushion",
            image: "/diamondimg/Cushion.png",
        },
        {
            name: "Radiant",
            image: "/diamondimg/Radiant.png",
        },
        {
            name: "Emerald",
            image: "/diamondimg/Emerald.png",
        },
        {
            name: "Princess",
            image: "/diamondimg/Princess.png",
        },
        {
            name: "Marquise",
            image: "/diamondimg/Marquise.png",
        },
        {
            name: "Pear",
            image: "/diamondimg/Pear.png",
        },
        {
            name: "Asscher",
            image: "/diamondimg/Ascher.png",
        },
    ];

    const getMetalType = () => {

    if (selections.metal === "#E6BE5A") {
        return "yellow";
    }

    if (selections.metal === "#E0E0E0") {
        return "white";
    }

    if (selections.metal === "#f1a886") {
        return "rose";
    }

    return "yellow";
};

    const handelSkip = () => {
        // navigate("/ring-builder")
         onSkip();
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#e4e5de] overflow-y-auto">

            {/* CONTAINER */}
            <div className="min-h-screen w-full flex flex-col items-center px-4 py-6 sm:px-6 md:px-10">

                {/* HEADER */}
                <div className="w-full max-w-6xl">

                    {/* TOP BAR */}
                    <div className="flex items-center justify-between mb-6">

                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="text-sm sm:text-base text-black font-medium hover:text-black"
                            >
                                ← Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            className="text-sm sm:text-base text-black font-bold hover:text-black"
                            onClick={handelSkip}
                        >
                            Skip
                        </button>
                    </div>

                    {/* TITLE */}
                    <div className="text-center mb-8 sm:mb-10">

                        <span className="text-xs sm:text-sm tracking-widest uppercase text-gray-500 font-semibold">
                            Step {step} of 3
                        </span>

                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-2 leading-tight">
                            {step === 1 && "Let's start designing your ring"}
                            {step === 2 && "Choose your center stone"}
                            {step === 3 && "Select your center stone size"}
                        </h2>

                        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl mx-auto">
                            {step === 1 &&
                                "Tell us the style, metal and stone shape you want."}

                            {step === 2 &&
                                "Pick the diamond shape that matches your vision."}

                            {step === 3 &&
                                "Choose a size or decide later."}
                        </p>
                    </div>

                    {/* ========================= */}
                    {/* STEP 1 */}
                    {/* ========================= */}

                    {step === 1 && (
                        <>

                            {/* METAL COLORS */}
                            <div className="flex justify-center gap-3 flex-wrap mb-8">

                                {[
                                    { color: "#E6BE5A", label: "Yellow" },
                                    { color: "#E0E0E0", label: "White" },
                                    { color: "#f1a886", label: "Rose" },
                                ].map((option) => (

                                    <button
                                        key={option.label}
                                        onClick={() =>
                                            setSelections({
                                                ...selections,
                                                metal: option.color,
                                            })
                                        }
                                        className={`
                                            min-w-[90px]
                                            sm:min-w-[120px]
                                            py-2.5
                                            sm:py-3
                                            px-4
                                            rounded-full
                                            text-sm
                                            sm:text-base
                                            font-semibold
                                            border-2
                                            transition-all
                                            duration-200
                                            ${selections.metal === option.color
                                                ? "border-black scale-105"
                                                : "border-transparent"}
                                        `}
                                        style={{
                                            backgroundColor: option.color,
                                            color:
                                                option.color === "#E0E0E0"
                                                    ? "#000"
                                                    : "#fff",
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {/* STYLE GRID */}

                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-4
                                sm:gap-4
                            ">

                                {styles.map((style) => {

    const metalType = getMetalType();

    const currentImage = style.images?.[metalType];

    return (

        <div
            key={style.name}
                                        onClick={() => {
                                            setSelections({
                                                ...selections,
                                                style:style.name,
                                            });

                                            nextStep();
                                        }}
                                        className="
                                            
                                            rounded-2xl
                                            border
                                            border-gray-500
                                            hover:border-blue-500
                                            cursor-pointer
                                            p-4
                                            sm:p-6
                                            transition-all
                                            duration-300
                                            hover:shadow-lg
                                            hover:text-blue-600
                                        "
                                    >

                                        {/* IMAGE */}
                                        <div className="
                                            h-40
                                            sm:h-42
                                            rounded-xl
                                            flex
                                            items-center
                                            justify-center
                                            mb-4
                                        ">
                                            <img
                                                src={currentImage}
                                                alt={style.name}
                                                className="
                                                    h-28
                                                    sm:h-36
                                                    object-contain
                                                "
                                            />
                                        </div>

                                        <h3 className="
                                            text-lg
                                            sm:text-xl
                                            font-bold
                                            text-center
                                        ">
                                            {style.name}
                                        </h3>
                                    </div>
                                )})}


                            </div>
                        </>
                    )}

                    {/* ========================= */}
                    {/* STEP 2 */}
                    {/* ========================= */}

                    {step === 2 && (

                        <div className="
                            grid
                            grid-cols-2
                            sm:grid-cols-3
                            lg:grid-cols-3
                            gap-4
                            sm:gap-6
                        ">

                            {shapes.map((shape) => (

                                <div
                                    key={shape.name}
                                    onClick={() => {
                                        setSelections({
                                            ...selections,
                                            shape: shape.name,
                                        });

                                        nextStep();
                                    }}
                                    className="
                                        bg-white
                                        p-4
                                        sm:p-6
                                        rounded-2xl
                                        border-2
                                        border-transparent
                                        hover:border-green-500
                                        cursor-pointer
                                        text-center
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:shadow-lg
                                        hover:text-green-600
                                    "
                                >

                                    {/* PNG IMAGE */}

                                    <div className="
                                        h-24
                                        sm:h-20
                                        flex
                                        items-center
                                        justify-center
                                        mb-3
                                    ">

                                        <img
                                            src={shape.image}
                                            alt={shape.name}
                                            className="
                                                w-16
                                                h-16
                                                sm:w-20
                                                sm:h-20
                                                object-contain
                                            "
                                        />
                                    </div>

                                    <h3 className="
                                        text-base
                                        sm:text-xl
                                        font-bold
                                        
                                    ">
                                        {shape.name}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ========================= */}
                    {/* STEP 3 */}
                    {/* ========================= */}

                    {step === 3 && (

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-4
                            max-w-2xl
                            mx-auto
                        ">

                            {[1.0, 2.0, 3.0, 4.0, 5.0].map((w) => (

                                <button
                                    key={w}
                                    onClick={() => handleFinalize(w)}
                                    className="
                                        bg-white
                                        py-4
                                        sm:py-5
                                        rounded-xl
                                        border-2
                                        font-bold
                                        text-lg
                                        hover:bg-black
                                        hover:text-white
                                        transition-all
                                    "
                                >
                                    {w} Carat
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    handleFinalize(selections.weight)
                                }
                                className="
                                    sm:col-span-2
                                    bg-white
                                    py-4
                                    sm:py-5
                                    rounded-xl
                                    border-2
                                    font-bold
                                    text-lg
                                    hover:bg-black
                                    hover:text-white
                                    transition-all
                                "
                            >
                                Decide later
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};