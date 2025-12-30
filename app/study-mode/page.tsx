"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useLocalStorage from "../hooks/useLocalStorage";
import withNoSSR from '../../components/noSSR';
import Image from "next/image";
import { shuffleFlashcards, resetFlashcardProgress, updateFlashcardProgress } from '@/redux/reducers/flashcardsSlice';
import CategoryOption from '@/components/CategoryOption';

import shuffleIcon from '../../assets/images/icon-shuffle.svg';
import PreviousIcon from '../../assets/images/icon-chevron-left.svg';
import NextIcon from '../../assets/images/icon-chevron-right.svg';
import StarBlueIcon from '../../assets/images/pattern-star-blue.svg';
import StarYellowIcon from '../../assets/images/pattern-star-yellow.svg';
import StarPinkIcon from '../../assets/images/pattern-star-pink.svg';
import checkIcon from '../../assets/images/icon-circle-check.svg';
import resetIcon from '../../assets/images/icon-reset.svg';
import statsTotalIcon from '../../assets/images/icon-stats-total.svg';
import MasteredIcon from '../../assets/images/icon-mastered.svg';
import InProgressIcon from '../../assets/images/icon-stats-in-progress.svg';
import NotStartedIcon from '../../assets/images/icon-stats-not-started.svg';
import DownIcon from '../../assets/images/icon-chevron-down.svg';

export interface FlashCard {
    id: string;
    question: string;
    answer: string;
    category: string;
    knownCount: number;
}

function StudyMode() {
    const [currentFlashcard, setCurrentFlashcard] = useLocalStorage('currentFlashcard', 1);
    const [revealAnswer, setRevealAnswer] = useLocalStorage('revealAnswer', false);
    const [hideMastered, setHideMastered] = useLocalStorage('hideMastered', '');
    const [categories, setCategories] = useLocalStorage('categories', []);
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useLocalStorage('selectedCategory', '');

    const allCards = useSelector((state: any) => state.flashcards.allFlashcards);

    const masteredCards = useSelector((state: any) => allCards?.filter((card: FlashCard) => card.knownCount === 5).length);
    const notStartedCards = useSelector((state: any) => allCards?.filter((card: FlashCard) => card.knownCount === 0).length);
    const inProgressCards = useSelector((state: any) => allCards?.filter((card: FlashCard) => card.knownCount !== 0 && card.knownCount !== 5).length);

    const mastered = useSelector((state: any) => allCards.filter((card: FlashCard) => card.knownCount !== 5));

    const flashcards = useSelector((state: any) => hideMastered ? mastered : allCards);

    const filteredFlashcards = selectedCategory ? flashcards?.filter((card: FlashCard) => card.category === selectedCategory) : flashcards;

    const dispatch = useDispatch();

    let flashcard = currentFlashcard > 1 ? filteredFlashcards && filteredFlashcards[currentFlashcard - 1] : filteredFlashcards && filteredFlashcards[0];

    useEffect(() => {
        localStorage.setItem('currentFlashcard', JSON.stringify(currentFlashcard));

        if (currentFlashcard === null) {
            setCurrentFlashcard(1);
        }

        if (currentFlashcard >= filteredFlashcards.length) {
            setCurrentFlashcard(filteredFlashcards.length);
        }

    }, [currentFlashcard]);

    useEffect(() => {
        localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));

    }, [selectedCategory]);

    useEffect(() => {
        setRevealAnswer(false);
    }, []);

    useEffect(() => {
        const getAllCategories = () => {
            let categories: string[] = [];

            for (let i = 0; i < allCards?.length; i++) {
                let category = allCards[i].category;

                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }

            return categories;
        }

        const allCategories = getAllCategories();
        setCategories(allCategories);

    }, [allCards]);


    const handleReveal = () => {
        setRevealAnswer(!revealAnswer);

        localStorage.setItem('revealAnswer', JSON.stringify(revealAnswer));
    };


    const handleMastered = (event: any) => {
        if (event.target.checked) {
            setHideMastered(true);
        } else {
            setHideMastered(false);
        }
    };

    const shuffle = () => {
        const flashcards = allCards;

        dispatch(shuffleFlashcards({ flashcards }));
    };

    const reset = () => {
        const flashcards = allCards;
        const id = filteredFlashcards[currentFlashcard - 1].id;

        dispatch(resetFlashcardProgress({ flashcards, id }));
    };

    const update = () => {
        const flashcards = allCards;
        const id = filteredFlashcards[currentFlashcard - 1].id;

        dispatch(updateFlashcardProgress({ flashcards, id }));
    };

    return (
        <>
            <div className="bg-[#F7F3F0] w-full h-auto flex flex-col items-center lg:flex-row" suppressHydrationWarning={true}>
                <div className='bg-white w-full md:w-3/4 border-black border-l-1 border-t-1 border-r-3 border-b-3 rounded-xl pt-6 pb-6'>
                    <div className="relative flex flex-row justify-between border-black border-b-1 pb-3 pl-3 pr-3 sm:pb-6 sm:pl-6 sm:pr-6">
                        <div className='flex flex-col sm:flex-row items-center'>
                            <div className='flex flex-row items-center bg-white rounded-full py-2 px-4 border-black border-1 cursor-pointer' onClick={() => setShowCategories(!showCategories)}>
                                <span className='cursor-pointer font-semibold'>{selectedCategory ? selectedCategory : 'All Categories'}</span>
                                <Image className='ml-2' src={DownIcon.src} alt='down-icon' width={0} height={0} style={{ width: '17px', height: '17px' }} />
                            </div>

                            <div className="flex justify-self-start mt-3 -ml-12 sm:-ml-2">
                                <input className='ml-6 mr-2 cursor-pointer' type='checkbox' checked={hideMastered} onChange={handleMastered}></input>
                                <span className="font-semibold">Hide Mastered</span>
                            </div>
                        </div>

                        <div>
                            <button className="flex flex-row rounded-full border-black border-1 py-2 px-4 cursor-pointer items-center font-semibold" onClick={shuffle}>
                                <Image className="mr-2" src={shuffleIcon.src} alt='shuffle-icon' width={0} height={0} style={{ width: '17px', height: '17px' }} />
                                Shuffle
                            </button>
                        </div>

                        {showCategories &&
                            <div className="absolute top-13 left-6 z-100 text-sm font-semibold border-t-1 border-l-1 border-r-1 rounded-t-lg rounded-b-lg" id='categories'>
                                {categories?.length && categories.map((category: string, index: number) =>
                                    <CategoryOption key={index} category={category} index={index} categories={categories} flashcards={flashcards} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setShowCategories={setShowCategories} />)}
                            </div>
                        }

                    </div>

                    <div className='p-6'>
                        {revealAnswer === false ?
                            (
                                <div className="relative bg-[#FC8AE5] pt-6 pb-6 flex flex-col items-center rounded-xl border-black border-t-2 border-r-4 border-b-4 border-l-2" onClick={handleReveal}>
                                    <div className='bg-white rounded-full py-1 px-3 border-black border-t-1 border-l-1 border-b-2 border-r-2 text-sm'>{flashcard && flashcard.category}</div>

                                    <div className='pt-20 pb-20 flex flex-col items-center'>
                                        <div className="text-4xl font-black text-center">{flashcard && flashcard.question}</div>
                                        <div className="pt-4 text-lg">Click to reveal answer</div>
                                    </div>

                                    <div className="flex flex-row items-center text-sm">
                                        <progress className='w-17 h-2' id='mastery' value={flashcard && flashcard.knownCount} max={5}></progress>
                                        <label className="ml-2" htmlFor='mastery'>{flashcard && flashcard.knownCount}/5</label>
                                    </div>

                                    <Image className='absolute top-8 right-6' src={StarBlueIcon.src} alt='blue-star-icon' width={0} height={0} style={{ width: '25px', height: '25px' }} />
                                    <Image className="absolute bottom-8 left-8" src={StarYellowIcon.src} alt='yellow-star-icon' width={0} height={0} style={{ width: '30px', height: '30px' }} />
                                </div>
                            ) :
                            (
                                <div className="relative bg-[#92ADEB] pt-6 pb-6 flex flex-col items-center rounded-xl border-black border-t-2 border-r-4 border-b-4 border-l-2" onClick={handleReveal}>
                                    <div className='bg-white rounded-full py-1 px-3 border-black border-t-1 border-l-1 border-b-2 border-r-2 text-sm'>{flashcard && flashcard.category}</div>

                                    <div className='pt-20 pb-20 flex flex-col items-center'>
                                        <div className="text-md text-center">Answer:</div>
                                        <div className="pt-4 pl-4 pr-4 text-center text-2xl font-black">{flashcard && flashcard.answer}</div>
                                    </div>

                                    <div className="flex flex-row items-center text-sm">
                                        <progress className='w-17 h-2' id='mastery' value={flashcard && flashcard.knownCount} max={5}></progress>
                                        <label className="ml-2" htmlFor='mastery'>{flashcard && flashcard.knownCount}/5</label>
                                    </div>

                                    <Image className='absolute top-8 right-6' src={StarPinkIcon.src} alt='pink-star-icon' width={0} height={0} style={{ width: '25px', height: '25px' }} />
                                    <Image className="absolute bottom-8 left-8" src={StarYellowIcon.src} alt='yellow-star-icon' width={0} height={0} style={{ width: '30px', height: '30px' }} />
                                </div>
                            )
                        }

                        <div className="flex flex-row justify-center pt-6">
                            <button className='flex flex-row rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 mr-5 items-center cursor-pointer font-semibold hover:bg-[#F8CB46]' onClick={update}>
                                <Image className='mr-2' src={checkIcon.src} alt='check-icon' width={0} height={0} style={{ width: '18px', height: '18px' }} />
                                I Know This
                            </button>

                            <button className='flex flex-row rounded-full border-black border-t-1 border-l-1 border-r-3 border-b-3 py-2 px-4 items-center cursor-pointer font-semibold hover:bg-[#F8CB46]' onClick={reset}>
                                <Image className='mr-2' src={resetIcon.src} alt='reset-icon' width={0} height={0} style={{ width: '15px', height: '15px' }} />
                                Reset Progress
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-row justify-between items-center pt-6 pl-6 pr-6 border-black border-t-1'>
                        <button className="flex flex-row rounded-full border-black border-1 py-2 px-4 items-center font-semibold cursor-pointer" onClick={() => currentFlashcard > 1 ? setCurrentFlashcard(currentFlashcard - 1) : setCurrentFlashcard(1)}>
                            <Image className='mr-2' src={PreviousIcon.src} alt='previous-icon' width={0} height={0} style={{ width: '18px', height: '18px' }} />
                            Previous
                        </button>

                        <span suppressHydrationWarning={true}>Card {currentFlashcard === null ? 1 : currentFlashcard} of {filteredFlashcards && filteredFlashcards.length}</span>

                        <button className="flex flex-row rounded-full border-black border-1 py-2 px-4 items-center font-semibold cursor-pointer" onClick={() => currentFlashcard === null ? setCurrentFlashcard(2) : setCurrentFlashcard(currentFlashcard + 1)}>
                            Next
                            <Image className='ml-2' src={NextIcon.src} alt='next-icon' width={0} height={0} style={{ width: '18px', height: '18px' }} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col bg-white w-full md:w-3/4 lg:w-1/3 lg:h-163 border-black border-l-1 border-t-1 border-r-3 border-b-3 rounded-xl my-6 md:my-6 lg:ml-6 p-6 lg:mt-6">
                    <h2 className="font-black text-2xl lg:mt-4 lg:mb-4">Study Statistics</h2>
                    <div className="flex flex-col sm:flex-none sm:grid sm:grid-cols-2 sm:gap-3 sm:row-start-1 lg:flex lg:flex-col">
                        <div className='mt-4 flex flex-row border-black border-t-1 border-l-2 border-r-1 border-b-2 rounded-xl'>
                            <div className='w-2/3 p-6 lg:h-28 text-lg font-medium'>
                                Total Cards
                                <div className="text-4xl font-black mt-2">{allCards?.length}</div>
                            </div>

                            <div className='w-1/3 bg-[#92ADEB] rounded-r-xl flex justify-center items-center'>
                                <Image src={statsTotalIcon.src} alt='stats-total-icon' width={0} height={0} style={{ width: '25px', height: '25px' }} />
                            </div>
                        </div>

                        <div className='mt-3 flex flex-row border-black border-t-1 border-l-2 border-r-1 border-b-2 rounded-xl'>
                            <div className='w-2/3 p-6 lg:h-28 text-lg font-medium'>
                                Mastered
                                <div className="text-4xl font-black mt-2">{masteredCards}</div>
                            </div>

                            <div className='w-1/3 bg-[#47D9C9] rounded-r-xl flex justify-center items-center'>
                                <Image src={MasteredIcon.src} alt='mastered-icon' width={0} height={0} style={{ width: '27px', height: '27px' }} />
                            </div>
                        </div>

                        <div className='mt-3 flex flex-row border-black border-t-1 border-l-2 border-r-1 border-b-2 rounded-xl'>
                            <div className='w-2/3 p-6 lg:h-28 text-lg font-medium'>
                                In Progress
                                <div className="text-4xl font-black mt-2">{inProgressCards}</div>
                            </div>

                            <div className='w-1/3 bg-[#F073A3] rounded-r-xl flex justify-center items-center'>
                                <Image src={InProgressIcon.src} alt='in-progress-icon' width={0} height={0} style={{ width: '27px', height: '27px' }} />
                            </div>
                        </div>

                        <div className='mt-3 flex flex-row  border-black border-t-1 border-l-2 border-r-1 border-b-2 rounded-xl'>
                            <div className='w-2/3 p-6 lg:h-28 text-lg font-medium'>
                                Not Started
                                <div className="text-4xl font-black mt-2">{notStartedCards}</div>
                            </div>

                            <div className='w-1/3 bg-[#FC8AE5] rounded-r-xl flex justify-center items-center'>
                                <Image src={NotStartedIcon.src} alt='not-started-icon' width={0} height={0} style={{ width: '27px', height: '27px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withNoSSR(StudyMode);

