import { useState, Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import { FlashCard } from "@/app/study-mode/page";
import MenuIcon from '../assets/images/icon-menu.svg';
import MasteredIcon from '../assets/images/icon-mastered.svg';
import EditIcon from '../assets/images/icon-edit.svg';
import DeleteIcon from '../assets/images/icon-delete.svg';

interface FlashcardProps {
    card: FlashCard;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
    setShowEditModal: Dispatch<SetStateAction<boolean>>;
    setSelectedCard: Dispatch<SetStateAction<FlashCard>>;
}

export default function Flashcard({ card, setShowDeleteModal, setShowEditModal, setSelectedCard }: FlashcardProps) {
    const [displayOptions, setDisplayOptions] = useState(false);

    return (
        <div className="relative bg-white mb-6 md:mb-0 rounded-xl border-black border-t-1 border-l-1 border-r-3 border-b-3 flex flex-col h-67">
            <div className="flex flex-row items-center font-bold text-xl pt-3 pl-3 pb-3 pr-4 border-black border-b-1 min-h-20">{card.question}</div>

            <div className="pt-3 pl-3 pb-3 pr-3 border-black border-b-1 h-35">
                <div className="text-gray-500 text-sm">Answer:</div>
                <div className="mt-1 mb-1 text-sm">{card.answer}</div>
            </div>

            <div className="flex flex-row justify-between h-12">
                <div className=" flex items-center border-black border-r-1 w-max h-12">
                    <div className="w-max text-xs rounded-full py-1 px-3 border-black border-t-1 border-l-1 border-r-2 border-b-2 mx-2">{card.category}</div>
                </div>

                <div className="flex flex-row items-center text-xs mx-2">
                    {card.knownCount < 5 ?
                        <>
                            <progress className='w-17 h-2 border-black border-1 outline-1' id='mastery-all' value={card && card.knownCount} max={5}></progress>
                            <label className="ml-2" htmlFor='mastery-all'>{card && card.knownCount}/5</label>
                        </> :

                        <div className="bg-[#47D9C9] flex flex-row items-center text-xs font-semibold rounded-full py-1 px-2 border-black border-t-1 border-l-1 border-r-2 border-b-2 mx-2">
                            <Image src={MasteredIcon.src} alt='mastered-icon' width={0} height={0} style={{ width: '15px', height: '15px' }} />
                            <div className='ml-1'>Mastered <span>5/5</span></div>
                        </div>
                    }
                </div>

                <div className="flex justify-center items-center border-black border-l-1 h-12 cursor-pointer w-10">
                    <div className='hover:border-black hover:border-t-1 hover:border-l-1 hover:border-r-3 hover:border-b-3 hover:rounded-lg w-7' onClick={() => setDisplayOptions(!displayOptions)}>
                        <Image src={MenuIcon.src} alt='menu-icon' width={0} height={0} style={{ width: '25px', height: '25px' }} />
                    </div>
                </div>
            </div>

            {displayOptions &&
                <div className='absolute bottom-13 right-0 border-black border-1 rounded-xl w-35 text-sm'>
                    <div className='flex flex-row items-center bg-white border-black border-b-1 rounded-t-xl pt-2 pl-2 pb-2 cursor-pointer' onClick={() => { setShowEditModal(true); setDisplayOptions(false); setSelectedCard(card) }}>
                        <Image className='ml-1' src={EditIcon.src} alt='edit-icon' width={0} height={0} style={{ width: '18px', height: '18px' }} />
                        <span className='ml-2'>Edit</span>
                    </div>

                    <div className='flex flex-row bg-white items-center rounded-b-xl pt-2 pl-2 pb-2 cursor-pointer' onClick={() => { setShowDeleteModal(true); setDisplayOptions(false); setSelectedCard(card) }}>
                        <Image src={DeleteIcon.src} alt='delete-icon' width={0} height={0} style={{ width: '20px', height: '20px' }} />
                        <span className='ml-2'>Delete</span>
                    </div>
                </div>
            }
        </div>
    )
}