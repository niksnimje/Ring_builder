import React from 'react'
import { IoGrid } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function DiamondGrid({ diaData, currentPage, onPageChange, handlePreviousPage, handleNextPage }) {
    const navigate = useNavigate();

    const handleGridClick = () => {
        navigate('/diamond/diamond-details', { state: { diaData } });
    };
    return (
        <div className='flex justify-end gap-2 mb-4'>
            <IoGrid onClick={handleGridClick} className="cursor-pointer" />
        </div>
    )
}
