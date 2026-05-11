import { pricingData } from "../components/datapath/pricingData";


export const calculatePrice = ({
    selectedShank,
    selectedProng,
    selectedDiamond,
    diamondWeight,
    selectedMetalColor,
}) => {

    // Extract the name from objects and weight value
    const shankName = selectedShank?.name;
    const prongName = selectedProng?.name;
    const diamondName = selectedDiamond?.name;
    const weightValue = diamondWeight?.value;

    // =========================
    // SHANK PRICE
    // =========================

    const shankPrice =
        pricingData.shank[shankName] || 0;

    // =========================
    // DIAMOND PRICE
    // =========================

    const diamondPrice =
        pricingData.diamond[diamondName]?.[weightValue] || 0;

    // =========================
    // PRONG PRICE
    // prong -> shape -> weight
    // =========================

    const prongPrice =
        pricingData.prong[prongName]?.[diamondName]?.[weightValue] || 0;

    // =========================
    // METAL COLOR PRICE
    // =========================

    const metalColorPrice =
        pricingData.metalColor[selectedMetalColor] || 0;

    // =========================
    // TOTAL
    // =========================

    const totalPrice =
        shankPrice +
        diamondPrice +
        prongPrice +
        metalColorPrice;

    return {
        shankPrice,
        diamondPrice,
        prongPrice,
        metalColorPrice,
        totalPrice,
    };
};