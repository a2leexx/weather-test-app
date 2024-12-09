import { useState } from 'react';
import './search.css';

// реализует строку ввода с кнопкой добавления
function Search(props : any) {
  const [text, setText] = useState('');

  // обрабатывает ввод текста
  const onChange = (e : any) => {
    setText(e.target.value);
  }

  // обрабатывает нажатие кнопки
  const onClickHandler = () => {
    props.onClick(text);
  }

  // обрабатывает нажатие клавиши Enter
  const handleKeyDown = (e : any) => {
    if (e.key === 'Enter')
      onClickHandler();
  }
    
  return (
    <div className="search">
      <input type="text" value={text} 
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder="Город"/>
      <button onClick={onClickHandler}>
        Добавить
      </button>
    </div>
  )
}

export default Search;