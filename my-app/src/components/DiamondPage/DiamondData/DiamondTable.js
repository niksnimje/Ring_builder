import React from "react";
import DiamondGrid from "../DiamondGrid/DiamondGrid";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";


export default function DiamondTable({ diamondData: diaData, setDiamondData, currentPage, onPageChange }) {

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) {
    //         onPageChange(currentPage - 1);
    //     }
    // };

    // const handleNextPage = () => {
    //     onPageChange(currentPage + 1);
    // };

    const columnDefs = [
        {
            headerName: "Wishlist",
            field: "WHSHLIST",
            // renderCell: (params) => {
            //     const diamondID = params.row.id;
            //     const isFavorite = favItems?.data?.some(
            //         (favItem) => favItem.data_id.id === diamondID && favItem.type === "diamond"
            //     );

            //     const handleFavoriteToggle = () => {
            //         const favItemToRemove = favItems.data?.find(
            //             (favItem) => favItem.data_id.id === diamondID && favItem.type === "diamond"
            //         );
            //         if (!isLoggedIn) {
            //             setShowAccountBox(true);
            //         } else {
            //             if (isFavorite) {
            //                 dispatch(removeFromWishlist(favItemToRemove.id)); // Use the specific item's ID
            //             } else {
            //                 dispatch(
            //                     addToWishlist({
            //                         data_id: diamondID,
            //                         user_id: user_id,
            //                         type: "diamond",
            //                     })
            //                 );
            //             }
            //         }
            //     };

            //     return (
            //         <div className="flex justify-center items-center h-full">
            //             <div
            //                 onClick={handleFavoriteToggle}
            //                 className={`cursor-pointer p-2 rounded-full transition-colors ${isFavorite ? "text-[#BCABA1] heart-fling" : "bg-transparent hover:text-gray-200"
            //                     }`}
            //             >
            //                 {isFavorite ? (
            //                     <IoMdHeart className="heart-filled" size="25" />
            //                 ) : (
            //                     <IoMdHeartEmpty color="black" size="25" />
            //                 )}
            //             </div>
            //         </div>
            //     );
            // },
        },
        { headerName: "ID", field: "id", filterable: true },
        {
            headerName: "Image", field: "Image Link",
            // renderCell: (params) => (
            //     <div className="flex justify-center items-center h-full cursor-pointer">
            //         <Link to={`/diamond/${params.row.id}`}>
            //             <img
            //                 src={params.value || "diamondimg/No Image Found 346x346.jpg"}
            //                 alt="diamond"
            //                 className="w-8 h-8 object-cover"
            //             />
            //         </Link>
            //     </div>
            // )
        },
        { headerName: "Stock #", field: "Stock #", sortable: true, filterable: true },
        {
            headerName: "Total Price",
            field: "Total Price",
            filterable: true,
            renderCell: (params) => {
                const value = parseFloat(params.value);
                if (isNaN(value)) return "";
                const [integerPart, decimalPart] = value.toString().split(".");
                if (!decimalPart) return integerPart;
                const truncatedDecimal = decimalPart.slice(0, decimalPart.length > 1 ? 2 : 1);
                return `${integerPart}.${truncatedDecimal}`;
            },
        },


        { headerName: "Shape", field: "Shape", filterable: true },
        { headerName: "Availability", field: "Availability", filterable: true },
        { headerName: "Weight", field: "Weight", filterable: true },
        { headerName: "Clarity", field: "Clarity", filterable: true },
        { headerName: "Color", field: "Color", filterable: true },
        { headerName: "Cut Grade", field: "Cut Grade", filterable: true },
        { headerName: "Polish", field: "Polish", filterable: true },
        { headerName: "Symmetry", field: "Symmetry", filterable: true },
        { headerName: "Price", field: "Price", filterable: true },

        { headerName: "Depth Percent", field: "Depth Percent", filterable: true },
        { headerName: "Table Percent", field: "Table Percent", filterable: true },
        { headerName: "Lab", field: "Lab", filterable: true },
        { headerName: "Fluorescence Intensity", field: "Fluorescence Intensity", filterable: true },
        { headerName: "Girdle Percent", field: "Girdle Percent", filterable: true },
        { headerName: "Girdle Condition", field: "Girdle Condition", filterable: true },
        { headerName: "Girdle Thick", field: "Girdle Thick", filterable: true },
        { headerName: "Girdle Thin", field: "Girdle Thin", filterable: true },
        { headerName: "Culet Size", field: "Culet Size", filterable: true },
        { headerName: "Cert Comment", field: "Cert Comment", filterable: true },
        { headerName: "Fluorescence Color", field: "Fluorescence Color", filterable: true },
        { headerName: "Crown Height", field: "Crown Height", filterable: true },
        { headerName: "Crown Angle", field: "Crown Angle", filterable: true },
        { headerName: "Pavilion Depth", field: "Pavilion Depth", filterable: true },
        { headerName: "Pavilion Angle", field: "Pavilion Angle", filterable: true },
        { headerName: "Laser Inscription", field: "Laser Inscription", filterable: true },
        { headerName: "Measurements", field: "Measurements", filterable: true },
        { headerName: "Certificate #", field: "Certificate #", filterable: true },
        { headerName: "Certificate Url", field: "Certificate Url", filterable: true },
        { headerName: "Discount Percent", field: "Discount Percent", filterable: true },
        { headerName: "Cash Discount Percent", field: "Cash Discount Percent", filterable: true },
        { headerName: "Treatment", field: "Treatment", filterable: true },
        { headerName: "Fancy Color", field: "Fancy Color", filterable: true },
        { headerName: "Fancy Color Intensity", field: "Fancy Color Intensity", filterable: true },
        { headerName: "Fancy Color Overtone", field: "Fancy Color Overtone", filterable: true },
        { headerName: "Member Comments", field: "Member Comments", filterable: true },
        { headerName: "Milky", field: "Milky", filterable: true },
        { headerName: "BGM", field: "BGM", filterable: true },
        { headerName: "Ratio", field: "ratio", filterable: true },
        {
            headerName: "Compare", field: "COMPARE",
            // renderCell: (params) => (
            //     <div className="flex justify-center items-center h-full">
            //         <div
            //             className={`w-5 h-5 rounded-sm border-2 transition-all cursor-pointer ${params.row.COMPARE ? 'border-transparent bg-[#BCABA1]' : 'border-gray-300 bg-[#E5E7EB]'}`}
            //             onClick={() => {
            //                 const updatedRowData = rowData.map(row =>
            //                     row.id === params.row.id ? { ...row, COMPARE: !row.COMPARE } : row
            //                 );
            //                 setRowData(updatedRowData);
            //             }}
            //         />
            //     </div>
            // )
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Diamonds Available</h2>

            <DiamondGrid
                // diaData={diaData}
                // handlePreviousPage={handlePreviousPage}
                // handleNextPage={handleNextPage}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
            <Box sx={{ height: '70%', width: '100%' }}>
                <DataGrid
                    // rows={rowData}
                    columns={columnDefs}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    // checkboxSelection
                    // disableRowSelectionOnClick
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                />
                <div className="flex justify-between">
                    {/* <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <button onClick={handleNextPage} disabled={rowData.length < 20}>Next</button> */}
                </div>
            </Box>

        </div>
    );
}
