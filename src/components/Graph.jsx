import './Graph.css';
import { useContext, useState } from 'react';
import { DiaryStateContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Button from './Button';
import emotion1 from '../assets/emotion1.png';
import emotion2 from '../assets/emotion2.png';
import emotion3 from '../assets/emotion3.png';
import emotion4 from '../assets/emotion4.png';
import emotion5 from '../assets/emotion5.png';

const Graph = () => {
    const { targetMonth } = useParams();
    const data = useContext(DiaryStateContext);
    const navigate = useNavigate();

    const emotionColors = { 1: "#64c964", 2: "#9dd772", 3: "#fdce17", 4: "#fd8446", 5: "#fd565f" };
    const labels = ["매우 좋음", "좋음", "그럭저럭", "나쁨", "매우 나쁨"];

    // 1. 해당 월 데이터만 계산
    const targetStats = [0, 0, 0, 0, 0];
    data.forEach((item) => {
        const date = new Date(item.date);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (yearMonth === targetMonth) {
            targetStats[item.emotionId - 1] += 1;
        }
    });

    const maxCount = Math.max(...targetStats);
    const maxIndex = targetStats.indexOf(maxCount);

    const getEmotionImg = (id) => {
        const images = { 1: emotion1, 2: emotion2, 3: emotion3, 4: emotion4, 5: emotion5 };
        return images[id];
    };


    const hasData = targetStats.some(count => count > 0);

    const [isStatsVisible, setIsStatsVisible] = useState(false);

    return (
        <div className="Graph">
            <h3>{targetMonth} 감정 통계</h3>
            <Header leftchild={<Button text={"< 뒤로가기"} onClick={() => navigate(-1)} />} />

            {!hasData ? (
                <p>이번 달에 작성된 일기가 없습니다.</p>
            ) : (
                <>
                    {/* 통계보기 버튼 또는 결과 박스 */}
                    {!isStatsVisible ? (
                        <button onClick={() => setIsStatsVisible(true)} className="stats_toggle_btn">
                            통계보기
                        </button>
                    ) : (
                        <div className="stats_result_box">
                            이번 달은
                            <img src={getEmotionImg(maxIndex + 1)} style={{ width: "30px", verticalAlign: "middle", margin: "0 5px" }} />
                            <strong style={{ color: emotionColors[maxIndex + 1] }}>{labels[maxIndex]}</strong>
                            감정이 가장 많으셨군요!
                            <span style={{ marginLeft: "10px", fontSize: "0.9em", color: "#666" }}>
                                (총 {maxCount}회)
                            </span>
                        </div>
                    )}

                    {/* 막대 그래프 부분 */}
                    <div className="bar_container">
                        {[1, 2, 3, 4, 5].map((id) => (
                            <div key={id} className="bar_wrapper">
                                <div className='bar' style={{
                                    height: `${targetStats[id - 1] * 10}px`,
                                    backgroundColor: emotionColors[id]
                                }}></div>
                                <img src={getEmotionImg(id)} style={{ width: "25px", marginTop: "10px" }} />
                                <div>{targetStats[id - 1]}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
export default Graph;