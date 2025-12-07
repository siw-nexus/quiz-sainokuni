'use client';

const OPTION_LABELS = {1: 'ア', 2: 'イ', 3: 'ウ', 4: 'エ'}

export default function OptionBtn() {
  return (
    <div>
      {Object.entries(OPTION_LABELS).map(([key, label]) => (
        <button
          key={key}
          // onClick={() => handleClick(key)}
          className='border'
        >
          {label}
        </button>
      ))}
    </div>
  );
}