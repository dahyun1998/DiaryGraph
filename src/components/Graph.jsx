import './Graph.css';
import { useContext } from 'react';
import { DiaryStateContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Button from './Button';

const Graph = () => {

    const navigate = useNavigate();

    const goBack = () => { navigate(-1); }

    const data = useContext(DiaryStateContext);

    const monthlyStats = {};

    const emotionColors = {
        1: "#64c964",
        2: "#9dd772",
        3: "#fdce17",
        4: "#fd8446",
        5: "#fd565f",
    };

    //감정별 계수 계산하기
    const counts = [0, 0, 0, 0, 0];

    for (let i = 0; i < data.length; i++) {

        const emotionId = data[i].emotionId;
        counts[emotionId - 1] += 1;

    }

    console.log("데이터 개수:", data.length);
    console.log("계산된 감정별 개수:", counts);

    const graphData = [
        { label: "매우 좋음", count: counts[0], id: 1 },
        { label: "좋음", count: counts[1], id: 2 },
        { label: "그럭저럭", count: counts[2], id: 3 },
        { label: "나쁨", count: counts[3], id: 4 },
        { label: "매우 나쁨", count: counts[4], id: 5 },
    ];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const date = new Date(item.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthlyStats[yearMonth]) {
            monthlyStats[yearMonth] = [0, 0, 0, 0, 0];
        }

        monthlyStats[yearMonth][item.emotionId - 1] += 1;
    }

    const months = Object.keys(monthlyStats);

    return (
        <div className="Graph">
            <h3>감정 통계</h3>
            <Header
                leftchild={<Button text={"< 뒤로가기"} onClick={goBack} />}
            />
            <div className="bar_container">
                {graphData.map((it) => (

                    <div key={it.id} className="bar_wrapper">
                        <div className='bar' style={{
                            height: `${it.count * 2}px`,
                            backgroundColor: emotionColors[it.id]
                        }}></div>
                        <span>{it.label}</span>
                        <div>{it.count}</div>
                    </div>
                ))}
            </div>

            <hr />

            <h3>월별 상세 통계</h3>
            {months.map((month) => {
                const counts = monthlyStats[month];
                const maxCount = Math.max(...counts);
                const maxIndex = counts.indexOf(maxCount);
                const emotionLabels = ["매우 좋음", "좋음", "그럭저럭", "나쁨", "매우 나쁨"];

                return (
                    <section key={month}>
                        <h4>{month}월</h4>
                        {/* 추가하신 문구 부분 */}
                        <p>이번 달은 <strong>{emotionLabels[maxIndex]}</strong> 감정이 가장 많으셨군요!</p>

                        <div className="bar_container">
                            {[1, 2, 3, 4, 5].map((emotionId) => (
                                <div key={emotionId} className="bar_wrapper">
                                    <div className='bar' style={{
                                        height: `${monthlyStats[month][emotionId - 1] * 5}px`,
                                        backgroundColor: emotionColors[emotionId]
                                    }}></div>
                                    <span>{emotionLabels[emotionId - 1]}</span>
                                    <div>{monthlyStats[month][emotionId - 1]}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
export default Graph;