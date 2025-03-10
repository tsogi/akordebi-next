import Link from 'next/link';
import styles from './NewsModal.module.css';

export default function TeachersNews({ onActionClick }) {
  return (
    <div className="space-y-4 mxedruli">
      <p>
        ჩვენს საიტს დაემატა გიტარის მასწავლებლების გვერდი, სადაც შეგიძლიათ:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>ნახოთ გიტარის მასწავლებლების სია</li>
        <li>დაამატოთ ახალი მასწავლებელი</li>
        <li>შეაფასოთ მასწავლებლები</li>
      </ul>
      <p>
          ერთად შევქმნათ კარგი მასწავლებლების ბაზა
      </p>
      <div className="mt-6">
        <Link 
          href="/teachers" 
          className={styles.actionButton}
          onClick={onActionClick}
        >
          გადასვლა მასწავლებლების გვერდზე
        </Link>
      </div>
    </div>
  );
} 