import { useSearchParams, useNavigate  } from "react-router-dom";
import Button from "./Button";
import Header from "./Header";
import Editor from "./Editor";
import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "../App";
import { getMonthRangeByDate } from "./util";
import DiaryList from "./DiaryList";
const Home = () => {
    // const [searchParams, setSearchParams] = useSearchParams();
    // console.log(searchParams.get("sort"));
    // console.log(searchParams);

    const navigate = useNavigate();

    const data = useContext(DiaryStateContext);

    //필터링한 일기를 저장할 state 준비하기
    const [filteredData, setFilteredData] = useState([]);

    const [pivotDate, setPivotDate] = useState(new Date());
    const headerTitle = `${pivotDate.getFullYear()}년 ${pivotDate.getMonth() + 1}월`;

    const onDecreaseMonth = () => {
        setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() - 1));
    }
    const onIncreaseMonth = () => {
        setPivotDate(new Date(pivotDate.getFullYear(), pivotDate.getMonth() + 1));
    }

    useEffect(() => {
        if (data.length >= 1) {
            const { beginTimeStamp, endTimeStamp } = getMonthRangeByDate(pivotDate)
            setFilteredData(
                data.filter((it) => beginTimeStamp <= it.date && it.date <= endTimeStamp)
            );
        }
        else {
            setFilteredData([]);
        }
    }, [data, pivotDate]);

    return (
        <>
            <div>Home 페이지</div>
            <div>
                <Header
                    title={headerTitle}
                    leftchild={<Button text="<" onClick={onDecreaseMonth} />}
                    rightchild={<Button text=">" onClick={onIncreaseMonth} />} />
                <Button
                    text={"감정 통계 보기"}
                    onClick={() => {
                        console.log("버튼 클릭됨!"); // 이게 콘솔에 찍히는지 확인
                        navigate("/stats");
                    }}
                />
                <DiaryList data={filteredData} />
            </div>
        </>
    );
}

export default Home;