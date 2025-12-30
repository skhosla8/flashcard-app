'use client';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useLocalStorage from "../hooks/useLocalStorage";
import { shuffleFlashcards, addFlashcard, editFlashcard, deleteFlashcard } from '@/redux/reducers/flashcardsSlice';
import CategoryOption from '@/components/CategoryOption';
import { FlashCard } from '../study-mode/page';
import Flashcard from '@/components/Flashcard';

import PlusIcon from '../../assets/images/icon-circle-plus.svg';
import DownIcon from '../../assets/images/icon-chevron-down.svg';
import shuffleIcon from '../../assets/images/icon-shuffle.svg';

export default function AllCards() {
    const [hideMasteredAll, setHideMasteredAll] = useLocalStorage('hideMasteredAll', '');
    const [selectedCategoryAll, setSelectedCategoryAll] = useLocalStorage('selectedCategoryAll', '');
    const [categoriesAll, setCategoriesAll] = useLocalStorage('categoriesAll', []);

    const [showCategoriesAll, setShowCategoriesAll] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<FlashCard>({
        id: '',
        question: '',
        answer: '',
        category: '',
        knownCount: 0
    });

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [category, setCategory] = useState('');

    const allCardsAll = useSelector((state: any) => state.flashcards.allFlashcards);

    const masteredAll = useSelector((state: any) => allCardsAll.filter((card: FlashCard) => card.knownCount !== 5));
    const flashcardsAll = useSelector((state: any) => hideMasteredAll ? masteredAll : allCardsAll);

    const filteredFlashcardsAll = selectedCategoryAll ? flashcardsAll?.filter((card: FlashCard) => card.category === selectedCategoryAll) : flashcardsAll
    const displayedCards = !loadMore ? filteredFlashcardsAll?.slice(0, 12) : filteredFlashcardsAll;

    const dispatch = useDispatch();

    useEffect(() => {
        const getAllCategories = () => {
            let categories: string[] = [];

            for (let i = 0; i < allCardsAll?.length; i++) {
                let category = allCardsAll[i].category;

                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }

            return categories;
        }

        const allCategories = getAllCategories();
        setCategoriesAll(allCategories);

    }, [allCardsAll]);

    const handleMastered = (event: any) => {
        if (event.target.checked) {
            setHideMasteredAll(true);
        } else {
            setHideMasteredAll(false);
        }
    };

    const shuffle = () => {
        const flashcards = allCardsAll;

        dispatch(shuffleFlashcards({ flashcards }));
    };

    const handleQuestion = (event: any) => {
        setQuestion(event.target.value);
    };

    const handleAnswer = (event: any) => {
        setAnswer(event.target.value);
    };

    const handleCategory = (event: any) => {
        setCategory(event.target.value);
    };

    const createCard = () => {
        const prevId = Number(filteredFlashcardsAll[filteredFlashcardsAll.length - 1].id.split('fc')[1]);

        const card = {
            id: `fc0${prevId + 1}`,
            question: question.charAt(0).toUpperCase() + question.slice(1),
            answer: answer.charAt(0).toUpperCase() + answer.slice(1),
            category: category.charAt(0).toUpperCase() + category.slice(1),
            knownCount: 0
        }

        dispatch(addFlashcard({ card }));
        setQuestion('');
        setAnswer('');
        setCategory('');
    };

    const deleteCard = () => {
        const element = allCardsAll.findIndex((flashcard: FlashCard) => flashcard.id === selectedCard.id);

        let cards = [...allCardsAll];

        cards.splice(element, 1);

        dispatch(deleteFlashcard({ cards }));
        setShowDeleteModal(false);
    }

    const editCard = () => {
        const element = allCardsAll.findIndex((flashcard: FlashCard) => flashcard.id === selectedCard.id);

        let cards = [...allCardsAll];

        const updatedCard = selectedCard;

        cards.splice(element, 1, updatedCard);

        dispatch(editFlashcard({ cards }));
        setShowEditModal(false);
    };

    return (
        <>
            <div className="bg-white w-full sm:w-5/6 md:w-4/5 mt-6 border-black border-l-1 border-t-1 border-r-3 border-b-3 rounded-xl p-6 font-medium">
                <div className='flex flex-col'>
                    <label className='mb-1' htmlFor='question'>Question</label>
                    <input className='border-1 pt-3 pl-3 pb-3 rounded-xl mb-3' type='text' name='question' value={question} placeholder='e.g., What is the capital of France?' onChange={handleQuestion} />
                </div>

                <div className='flex flex-col'>
                    <label htmlFor='answer'>Answer</label>
                    <textarea className='border-1 pt-3 pl-3 pb-3 rounded-xl mb-3' name='answer' value={answer} rows={6} placeholder='e.g., Paris' onChange={handleAnswer}></textarea>
                </div>

                <div className='flex flex-col'>
                    <label htmlFor='category'>Category</label>
                    <input className='border-1 pt-3 pl-3 pb-3 rounded-xl mb-6' type='text' name='category' value={category} placeholder='e.g., Geography' onChange={handleCategory} />
                </div>

                <button className="flex flex-row rounded-full rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 cursor-pointer items-center font-semibold bg-[#F8CB46]" onClick={createCard}>
                    <Image src={PlusIcon.src} alt='circle-plus-icon' width={0} height={0} style={{ width: '17px', height: '17px' }} />
                    <span className="ml-2">Create Card</span>
                </button>
            </div>

            <div className='relative w-full sm:w-5/6 md:w-4/5 flex flex-row justify-between items-center'>
                <div className='flex flex-col sm:flex-row items-center mt-10 mb-8'>
                    <div className='flex flex-row items-center bg-white rounded-full py-2 px-4 border-black border-1 cursor-pointer' onClick={() => setShowCategoriesAll(!showCategoriesAll)}>
                        <span className='cursor-pointer font-semibold'>All Categories</span>
                        <Image className='ml-2' src={DownIcon.src} alt='down-icon' width={0} height={0} style={{ width: '17px', height: '17px' }} />
                    </div>

                    <div className='flex justify-self-start mt-3 sm:mt-0 -ml-12 sm:-ml-2'>
                        <input className='ml-6 mr-2 cursor-pointer' type='checkbox' checked={hideMasteredAll} onChange={handleMastered}></input>
                        <span className="font-semibold">Hide Mastered</span>
                    </div>
                </div>

                <div>
                    <button className="flex flex-row rounded-full border-black border-1 py-2 px-4 cursor-pointer items-center font-semibold" onClick={shuffle}>
                        <Image className="mr-2" src={shuffleIcon.src} alt='shuffle-icon' width={0} height={0} style={{ width: '17px', height: '17px' }} />
                        Shuffle
                    </button>
                </div>

                {showCategoriesAll &&
                    <div className="absolute top-22 left-1 z-100 text-sm font-semibold border-t-1 border-l-1 border-r-1 rounded-t-lg rounded-b-lg" id='categories'>
                        {categoriesAll?.length && categoriesAll.map((category: string, index: number) =>
                            <CategoryOption key={index} category={category} index={index} categories={categoriesAll} flashcards={flashcardsAll} selectedCategory={selectedCategoryAll} setSelectedCategory={setSelectedCategoryAll} setShowCategories={setShowCategoriesAll} />)}
                    </div>
                }
            </div>

            <div className='sm:w-5/6 md:w-4/5'>
                <div className='md:grid md:grid-cols-2 md:gap-4 2xl:grid-cols-3'>
                    {displayedCards?.map((card: FlashCard, i: number) =>
                        <Flashcard key={i} card={card} setShowDeleteModal={setShowDeleteModal} setShowEditModal={setShowEditModal} setSelectedCard={setSelectedCard} />
                    )}
                </div>

                <button className="flex flex-row justify-self-center self-center rounded-full rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 cursor-pointer font-semibold bg-white mt-8 mb-8" onClick={() => setLoadMore(!loadMore)}>
                    {!loadMore ? 'Load More' : 'Show Less'}
                </button>
            </div>

            {showDeleteModal &&
                <>
                    <div className='fixed inset-0 bg-black opacity-70 grid place-items-center z-1000'></div>
                    <div className='fixed top-80 h-47 bg-white rounded-xl w-80 opacity-100 z-1200 border-black border-r-3 border-b-3'>
                        <div className='border-black border-b-1 pt-6 pl-6 pb-6'>
                            <div className='font-semibold text-2xl mb-2'>Delete this card?</div>
                            <div className='text-lg text-gray-900'>This action can't be undone.</div>
                        </div>

                        <div className='flex flex-row justify-end h-18'>
                            <button className='flex flex-row self-center bg-white rounded-full border-black border-1 py-2 px-4 cursor-pointer items-center font-semibold hover:bg-gray-100 mr-3' onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className='bg-[#F8CB46] flex flex-row self-center rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 cursor-pointer items-center font-semibold hover:border-r-5 hover:border-b-5 mr-5' onClick={deleteCard}>Delete Card</button>
                        </div>
                    </div>
                </>
            }

            {showEditModal &&
                <>
                    <div className='fixed inset-0 bg-black opacity-70 grid place-items-center z-1000'></div>
                    <div className='fixed top-80 bg-white pt-6 pl-4 pr-4 pb-5 rounded-xl w-80 opacity-100 z-1200 border-black border-r-3 border-b-3'>
                        <div className='font-semibold text-2xl mb-5'>Edit your card</div>

                        <div className='flex flex-col'>
                            <label className='font-medium mb-1' htmlFor='edit-question'>Question</label>
                            <input className='border-black border-1 rounded-lg mb-4 px-4 py-3 outline-none' type='text' id='edit-question' defaultValue={selectedCard.question} onChange={(event) => setSelectedCard({
                                id: selectedCard.id,
                                question: event.target.value,
                                answer: selectedCard.answer,
                                category: selectedCard.category,
                                knownCount: selectedCard.knownCount
                            })} />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-medium mb-1' htmlFor='edit-answer'>Answer</label>
                            <input className='border-black border-1 rounded-lg mb-4 px-4 py-3 outline-none' type='text' id='edit-answer' value={selectedCard.answer} onChange={(event) => setSelectedCard({
                                id: selectedCard.id,
                                question: selectedCard.question,
                                answer: event.target.value,
                                category: selectedCard.category,
                                knownCount: selectedCard.knownCount
                            })} />
                        </div>

                        <div className='flex flex-col'>
                            <label className='font-medium mb-1' htmlFor='edit-category'>Category</label>
                            <input className='border-black border-1 rounded-lg mb-4 px-4 py-3 outline-none' type='text' id='edit-category' value={selectedCard.category} onChange={(event) => setSelectedCard({
                                id: selectedCard.id,
                                question: selectedCard.question,
                                answer: selectedCard.answer,
                                category: event.target.value,
                                knownCount: selectedCard.knownCount
                            })} />
                        </div>

                        <div>
                            <button className='bg-[#F8CB46] flex flex-row justify-self-end rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 cursor-pointer items-center font-semibold hover:border-r-5 hover:border-b-5 mt-2' onClick={editCard}>Update Card</button>
                        </div>
                    </div>
                </>
            }
        </>
    )
}