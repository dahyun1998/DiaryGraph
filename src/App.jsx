import './App.css'
import { getEmotionImgById } from './components/util.js';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home.jsx';
import Edit from './components/Edit.jsx';
import New from './components/New.jsx';
import Diary from './components/Diary.jsx';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import DiaryList from './components/DiaryList.jsx';
import { mockData} from './components/diary_data_100.js';
import Graph from './components/Graph.jsx';

//정적인 상태 : data (diary 데이터)
export const DiaryStateContext = React.createContext();

//동적인 상태 : CRUD 기능 관련
export const DiaryDispatchContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE": return [action.data, ...state];
    case "UPDATE": return state.map((it) =>
      it.id === action.data.id ? { ...action.data } : it);
    case "DELETE": return state.filter((it) => it.id !== action.targetId);
    case "INIT":   return action.data;
    default:       return state;
  }
}

const App = () => {

  //초기데이터가 로딩되어이쓴지 여부 체크
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [data, dispatch] = useReducer(reducer, mockData);

  const idRef = useRef(5);

  const onCreate = (date, content, emotionId) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).getTime(),
        content,
        emotionId
      }
    });
    idRef.current += 1;
  };

  const onUpdate = (targetId, date, content, emotionId) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId
      }
    });
  };

  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      targetId
    });
  };

  //처음 App 시작시에 초기화
  useEffect(() => {
    dispatch({
      type: "INIT",
      data: mockData
    })

    setIsDataLoaded(true);
  }, []);

  if(!isDataLoaded) return <div>데이터 로딩중</div>;

  return (
    <>
      <DiaryStateContext.Provider value={data}>
       <DiaryDispatchContext.Provider value={{onCreate, onUpdate, onDelete}}>
        <Routes>
          <Route path="/" element={<Home />}> </Route>
          <Route path="/new" element={<New />}> </Route>
          <Route path="/diary/:id" element={<Diary />}> </Route>
          <Route path="/edit/:id" element={<Edit />}> </Route>
          <Route path="/stats/:targetMonth" element={<Graph/>}/>
        </Routes>
       </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>);
}

export default App
