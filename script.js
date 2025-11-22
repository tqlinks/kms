document.addEventListener('DOMContentLoaded', () => {
    // --- Khai báo các phần tử DOM ---
    const btnStart = document.getElementById('btn-start');
    const btnSubmit = document.getElementById('btn-submit');
    const btnTop10 = document.getElementById('btn-top10');
    const btnRegister = document.getElementById('btn-register');
    // Nút gợi ý mới
    const btnHint = document.getElementById('btn-hint'); 
    
    const gameArea = document.getElementById('game-area');
    const top10Area = document.getElementById('top10-area');
    const captchaImage = document.getElementById('captcha-image');
    const captchaInput = document.getElementById('captcha-input');
    const feedbackMessage = document.getElementById('feedback-message');
    const currentScoreSpan = document.getElementById('current-score');
    const questionCountSpan = document.getElementById('question-count');
    const playerNameSpan = document.getElementById('player-name');
    const top10List = document.getElementById('top10-list');

    // --- Biến Trạng thái Trò chơi ---
    let score = 0;
    let playerName = 'Khách';
    let questionsAnswered = 0;
    const MAX_QUESTIONS = 99; 
    let currentCaptcha = null;
    let availableCaptchas = []; 
    let topScores = JSON.parse(localStorage.getItem('maple_top10')) || []; 
    
    // --- Biến Thời gian & Điểm ---
    let timer; 
    let timeLeft = 60;
    const TIME_LIMIT = 60;
    const SCORE_CORRECT = 100;
    const SCORE_INCORRECT = -100;
    const SCORE_TIMEOUT = -100;
    const SCORE_HINT = -100; // Điểm trừ khi dùng gợi ý

    // --- Dữ liệu 99 Captcha (Đã nhúng trực tiếp) ---
    const ALL_CAPTCHAS_DATA = [
        { file: '1.gif', answer: '조수블루습격자' },
        { file: '2.gif', answer: '이프손잡이' },
        { file: '3.gif', answer: '레이벌쳐' },
        { file: '4.gif', answer: '에드엘리' },
        { file: '5.gif', answer: '프기갑병' },
        { file: '6.gif', answer: '새우가면' },
        { file: '7.gif', answer: '키라라룽칼로' },
        { file: '8.gif', answer: '트러블메이커' },
        { file: '9.gif', answer: '버크손님대신관' },
        { file: '10.gif', answer: '지그리드옐로우' },
        { file: '11.gif', answer: '현자렉스탕탕아' },
        { file: '12.gif', answer: '리스탄의영' },
        { file: '13.gif', answer: '얼어불은허무' },
        { file: '14.gif', answer: '트러블메이' },
        { file: '15.gif', answer: '드래곤터틀' },
        { file: '16.gif', answer: '붉은모래난쟁이' },
        { file: '17.gif', answer: '구천록노바지원' },
        { file: '18.gif', answer: '올리비아핑크빈' },
        { file: '19.gif', answer: '황룡아기바' },
        { file: '20.gif', answer: '추는빨간구' },
        { file: '21.gif', answer: '타픽시데들' },
        { file: '22.gif', answer: '들리디스트로이' },
        { file: '23.gif', answer: '첼릭버스' },
        { file: '24.gif', answer: '드래곤터틀' },
        { file: '25.gif', answer: '알베르트' },
        { file: '26.gif', answer: '타그래이' },
        { file: '27.gif', answer: '잃은그레이' },
        { file: '28.gif', answer: '염된수액삐빅' },
        { file: '29.gif', answer: '드릭체키스코' },
        { file: '30.gif', answer: '주시하는' },
        { file: '31.gif', answer: '얼어불은고독' },
        { file: '32.gif', answer: '이머파란버섯' },
        { file: '33.gif', answer: '더키패밀' },
        { file: '34.gif', answer: '시약의피조' },
        { file: '35.gif', answer: '장레옹모리' },
        { file: '36.gif', answer: '에델슈타인게시' },
        { file: '37.gif', answer: '렉스라일라' },
        { file: '38.gif', answer: '브라운테' },
        { file: '39.gif', answer: '파르마엘리쟈' },
        { file: '40.gif', answer: '데들리아울' },
        { file: '41.gif', answer: '로이스큰펭권' },
        { file: '42.gif', answer: '비올레타유리관' },
        { file: '43.gif', answer: '불꽃의사' },
        { file: '44.gif', answer: '들리디스트로이' },
        { file: '45.gif', answer: '계의제단' },
        { file: '46.gif', answer: '시미아나뭇가지' },
        { file: '47.gif', answer: '뒷골목의제이엠' },
        { file: '48.gif', answer: '스텐노무쇠' },
        { file: '49.gif', answer: '벨루어벤제롬' },
        { file: '50.gif', answer: '종자의수ha' },
        { file: '51.gif', answer: '올리버겨대스콜' },
        { file: '52.gif', answer: '말수적은' },
        { file: '53.gif', answer: '켈레톤밀리샤' },
        { file: '54.gif', answer: '리스마스케이크' },
        { file: '55.gif', answer: '해시태그폰' },
        { file: '56.gif', answer: '리프뚱뚱이라' },
        { file: '57.gif', answer: '지시그너스하스' },
        { file: '58.gif', answer: '다크예티와' },
        { file: '59.gif', answer: '자아스텀피' },
        { file: '60.gif', answer: '령이깃든푸' },
        { file: '61.gif', answer: '밀라타우로마' },
        { file: '62.gif', answer: '키누아리솔' },
        { file: '63.gif', answer: '라솔빙ha수토기' },
        { file: '64.gif', answer: '스타우로마시' },
        { file: '65.gif', answer: '한에르다스' },
        { file: '66.gif', answer: '시그너스' },
        { file: '67.gif', answer: '물갈색모래토끼' },
        { file: '68.gif', answer: '크리스탈게이' },
        { file: '69.gif', answer: '니쟁기소은월' },
        { file: '70.gif', answer: '강력한꽃덤불' },
        { file: '71.gif', answer: '킨E반한겨울' },
        { file: '72.gif', answer: '호문몽땅차크로' },
        { file: '73.gif', answer: '버스스켈레톤나' },
        { file: '74.gif', answer: '어둠의집행자' },
        { file: '75.gif', answer: '라이얀삼단지' },
        { file: '76.gif', answer: '비영웅을알아보' },
        { file: '77.gif', answer: '스티온이카르트' },
        { file: '78.gif', answer: '그릴스화' },
        { file: '79.gif', answer: '톤밀리샤' },
        { file: '80.gif', answer: '나인하트' },
        { file: '81.gif', answer: '트로이어' },
        { file: '82.gif', answer: '지그문트윌' },
        { file: '83.gif', answer: '팜오베론' },
        { file: '84.gif', answer: '콘트라베이스맨' },
        { file: '85.gif', answer: '마스터호브' },
        { file: '86.gif', answer: '흥부모코' },
        { file: '87.gif', answer: '옐로우불꽃마이' },
        { file: '88.gif', answer: '트러블메이커' },
        { file: '89.gif', answer: '리관작은불씨' },
        { file: '90.gif', answer: '스틸라장난감목' },
        { file: '91.gif', answer: '브리헤네' },
        { file: '92.gif', answer: '테일의왼쪽머' },
        { file: '93.gif', answer: '인매그너스' },
        { file: '94.gif', answer: '틱이계의사' },
        { file: '95.gif', answer: '파파픽시아카이' },
        { file: '96.gif', answer: '급닌자블록퍼스' },
        { file: '97.gif', answer: '니카울리카' },
        { file: '98.gif', answer: '신스펙터' },
        { file: '99.gif', answer: '칼라일혼돈' }
    ];
    // --- End Dữ liệu Captcha ---

    
    // --- 1. Hàm Cập nhật Điểm và Số câu hỏi ---
    function updateScore(change) {
        score += change;
        currentScoreSpan.textContent = score;
        questionCountSpan.textContent = `${questionsAnswered}/${MAX_QUESTIONS} (${timeLeft}s)`;
    }

    // --- 2. Hàm Quản lý Đồng hồ đếm ngược ---
    function startTimer() {
        clearInterval(timer); 
        timeLeft = TIME_LIMIT;
        
        questionCountSpan.textContent = `${questionsAnswered}/${MAX_QUESTIONS} (${timeLeft}s)`;
        
        timer = setInterval(() => {
            timeLeft--;
            questionCountSpan.textContent = `${questionsAnswered}/${MAX_QUESTIONS} (${timeLeft}s)`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000); 
    }
    
    // --- Xử lý khi hết giờ ---
    function handleTimeout() {
        btnHint.classList.add('hidden'); // Ẩn nút gợi ý
        updateScore(SCORE_TIMEOUT); 
        feedbackMessage.textContent = `⏰ HẾT GIỜ! Bạn bị trừ ${-SCORE_TIMEOUT} điểm.`;
        
        if (questionsAnswered < MAX_QUESTIONS) {
            setTimeout(setRandomCaptcha, 1500);
        } else {
            endGame();
        }
    }


    // --- 3. Hàm Thiết lập Captcha Ngẫu nhiên ---
    function setRandomCaptcha() {
        if (availableCaptchas.length === 0) {
            endGame();
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableCaptchas.length);
        currentCaptcha = availableCaptchas[randomIndex];

        availableCaptchas.splice(randomIndex, 1);

        captchaImage.src = `${currentCaptcha.file}`;
        captchaImage.alt = `Captcha: ${currentCaptcha.file}`;
        captchaInput.value = ''; 
        captchaInput.focus();
        feedbackMessage.textContent = 'Hãy nhập đáp án...';
        
        btnHint.classList.add('hidden'); // Luôn ẩn nút gợi ý khi chuyển câu mới
        startTimer();
    }
    
    // --- 4. Hàm Bắt đầu Trò chơi ---
    btnStart.addEventListener('click', () => {
        if (playerName === 'Khách') {
            alert('Vui lòng nhấn "Ghi Danh" và nhập tên trước khi bắt đầu trò chơi!');
            return;
        }
        
        // Reset trạng thái trò chơi
        score = 0;
        questionsAnswered = 0;
        updateScore(0);
        availableCaptchas = [...ALL_CAPTCHAS_DATA];
        
        gameArea.classList.remove('hidden');
        top10Area.classList.add('hidden');
        setRandomCaptcha();
    });

    // --- 5. Hàm Lưu Top 10 (Sử dụng Local Storage) ---
    function saveTopScore(name, finalScore) {
        if (finalScore === 0) return; 

        topScores.push({ name: name, score: finalScore, timestamp: Date.now() });

        let uniqueScores = {};
        topScores.forEach(entry => {
            if (!uniqueScores[entry.name] || entry.score > uniqueScores[entry.name].score) {
                uniqueScores[entry.name] = entry;
            }
        });
        
        topScores = Object.values(uniqueScores)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 10);
        
        localStorage.setItem('maple_top10', JSON.stringify(topScores));
    }
    
    // --- 6. Hàm Kết thúc Trò chơi ---
    function endGame() {
        clearInterval(timer);
        btnHint.classList.add('hidden');
        alert(`🎉 CHÚC MỪNG ${playerName}! Bạn đã hoàn thành ${MAX_QUESTIONS} câu hỏi với tổng điểm là: ${score}!`);
        
        saveTopScore(playerName, score); 
        
        gameArea.classList.add('hidden');
        displayTop10(); 
    }


    // --- 7. Kiểm tra Đáp án ---
    btnSubmit.addEventListener('click', () => {
        if (!currentCaptcha) {
             feedbackMessage.textContent = '❌ Hãy bấm "Bắt Đầu Trò Chơi"!';
             return;
        }
        
        clearInterval(timer); // Dừng timer để tính toán
        
        const userInput = captchaInput.value.trim();
        const correctAnswer = currentCaptcha.answer.trim();

        if (userInput === correctAnswer) {
            // Đáp án đúng
            questionsAnswered++;
            
            const timeBonus = timeLeft; 
            const totalScoreChange = SCORE_CORRECT + timeBonus;
            
            updateScore(totalScoreChange); 
            feedbackMessage.textContent = `✅ Chính xác! +${SCORE_CORRECT} điểm, +${timeBonus} điểm thưởng thời gian. Tổng cộng: +${totalScoreChange} điểm.`;
            
            btnHint.classList.add('hidden'); // Ẩn nút gợi ý sau khi trả lời đúng
            
            if (questionsAnswered < MAX_QUESTIONS) {
                setTimeout(setRandomCaptcha, 1000); 
            } else {
                endGame();
            }
            
        } else {
            // Đáp án sai
            updateScore(SCORE_INCORRECT); 
            feedbackMessage.textContent = `❌ Sai rồi! Bạn bị trừ ${-SCORE_INCORRECT} điểm. Thử lại hoặc Xem Đáp án.`;
            
            captchaInput.value = ''; 
            captchaInput.focus();
            
            btnHint.classList.remove('hidden'); // HIỂN THỊ NÚT GỢI Ý
            startTimer(); // Chạy lại timer cho câu hỏi này
        }
    });
    
    // --- 8. Chức năng Xem Đáp án (Gợi ý) MỚI ---
    btnHint.addEventListener('click', () => {
        if (!currentCaptcha || score < -SCORE_HINT) { // Kiểm tra điểm tránh bị âm quá nhiều
             alert('Bạn cần có ít nhất 100 điểm để xem đáp án!');
             return;
        }
        
        clearInterval(timer); // Dừng timer
        updateScore(SCORE_HINT); // Trừ 100 điểm
        
        const correctAnswer = currentCaptcha.answer.trim();
        feedbackMessage.textContent = `💡 ĐÁP ÁN: "${correctAnswer}". Bạn bị trừ ${-SCORE_HINT} điểm. Chuyển câu sau 3 giây.`;
        
        captchaInput.value = correctAnswer; // Hiển thị đáp án trong ô nhập
        
        // Coi như đã trả lời xong câu này (dù dùng gợi ý)
        questionsAnswered++; 
        btnHint.classList.add('hidden'); 

        if (questionsAnswered < MAX_QUESTIONS) {
            setTimeout(setRandomCaptcha, 3000); 
        } else {
            // Dù dùng gợi ý ở câu cuối cùng thì vẫn kết thúc trò chơi
            endGame(); 
        }
    });


    // Cho phép Enter để submit
    captchaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btnSubmit.click();
        }
    });

    // --- 9. Hàm Ghi Danh ---
    btnRegister.addEventListener('click', () => {
        const nameInput = prompt('Nhập tên người chơi của bạn (Tên sẽ dùng để lưu điểm):');
        if (nameInput && nameInput.trim() !== '') {
            playerName = nameInput.trim();
            playerNameSpan.textContent = playerName;
            alert(`Chào mừng, ${playerName}! Bạn đã sẵn sàng chơi!`);
        }
    });


    // --- 10. Hàm Hiển thị Top 10 ---
    function displayTop10() {
        topScores = JSON.parse(localStorage.getItem('maple_top10')) || [];
        
        gameArea.classList.add('hidden');
        top10Area.classList.remove('hidden');

        top10List.innerHTML = ''; 

        if (topScores.length === 0) {
            top10List.innerHTML = '<li>Chưa có người chơi nào ghi điểm cao.</li>';
            return;
        }

        topScores.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `#${index + 1}: ${item.name} - ${item.score} điểm`;
            top10List.appendChild(li);
        });
    }
    
    btnTop10.addEventListener('click', displayTop10);
    
    // Khởi tạo hiển thị
    displayTop10();
    top10Area.classList.remove('hidden'); 
    
    questionCountSpan.textContent = `0/${MAX_QUESTIONS} (${TIME_LIMIT}s)`;
});

