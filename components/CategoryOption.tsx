import { Dispatch, SetStateAction } from 'react';
import { FlashCard } from "@/app/study-mode/page";

interface CategoryOptionProps {
    category: string;
    index: number;
    flashcards: FlashCard[];
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    setShowCategories: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryOption({ category, index, categories, flashcards, selectedCategory, setSelectedCategory, setShowCategories }: CategoryOptionProps) {
    const numberOfCardsinCategory = flashcards?.length && flashcards.filter((card: FlashCard) => card.category === category).length;

    const handleChange = (event: any) => {
        if (event.target.checked) {
            setSelectedCategory(category);

            setTimeout(() => {
                setShowCategories(false);
            }, 1000);
        } else {
            setSelectedCategory('');

            setTimeout(() => {
                setShowCategories(false);
            }, 1000);
        };
    }

    return (
        <div className={`py-1 px-4 border-b-1 flex flex-row bg-white w-64 ${index === 0 && `rounded-t-lg`} ${index === categories.length - 1 && `rounded-b-lg`}`}>
            <input className='cursor-pointer' type='checkbox' checked={selectedCategory === category} value={category} onChange={handleChange} />
            <div className='ml-3'>
                {category}
                <span className="text-gray-500 ml-1">({numberOfCardsinCategory})</span>
            </div>
        </div>
    )
}