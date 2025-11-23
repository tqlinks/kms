document.addEventListener('DOMContentLoaded', () => {
    // --- Khai báo các phần tử DOM ---
    const btnStart = document.getElementById('btn-start');
    const btnSubmit = document.getElementById('btn-submit');
    const btnTop10 = document.getElementById('btn-top10');
    const btnRegister = document.getElementById('btn-register');
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
    const onlineAnnouncementText = document.getElementById('online-announcement-text');
    const onlineAnnouncementContainer = document.getElementById('online-announcement-container');

    const db = window.db; 

    // --- Biến Trạng thái Trò chơi ---
    let score = 0;
    let playerName = 'Khách';
    let questionsAnswered = 0;
    const MAX_QUESTIONS = 99; 
    let currentCaptcha = null;
    let availableCaptchas = []; 
    let consecutiveCorrects = 0; 
    
    // --- Biến Thời gian & Điểm ---
    let timer; 
    let timeLeft = 60;
    const TIME_LIMIT = 60;
    const SCORE_CORRECT = 100;
    const SCORE_INCORRECT = -100;
    const SCORE_TIMEOUT = -100;
    const SCORE_HINT = -100;

    // --- Dữ liệu 99 Captcha (Đã cập nhật) ---
    const ALL_CAPTCHAS_DATA = [
        { file: '1.gif', answer: '조수블루습격자' }, { file: '2.gif', answer: '이프손잡이' }, { file: '3.gif', answer: '레이벌쳐' },
        { file: '4.gif', answer: '에드엘리' }, { file: '5.gif', answer: '프기갑병' }, { file: '6.gif', answer: '새우가면' },
        { file: '7.gif', answer: '키라라룽칼로' }, { file: '8.gif', answer: '트러블메이커' }, { file: '9.gif', answer: '버크손님대신관' },
        { file: '10.gif', answer: '지그리드옐로우' }, { file: '11.gif', answer: '현자렉스탕탕아' }, { file: '12.gif', answer: '리스탄의영' },
        { file: '13.gif', answer: '얼어불은허무' }, { file: '14.gif', answer: '트러블메이' }, { file: '15.gif', answer: '드래곤터틀' },
        { file: '16.gif', answer: '붉은모래난쟁이' }, { file: '17.gif', answer: '구천록노바지원' }, { file: '18.gif', answer: '올리비아핑크빈' },
        { file: '19.gif', answer: '황룡아기바' }, { file: '20.gif', answer: '추는빨간구' }, { file: '21.gif', answer: '타픽시데들' },
        { file: '22.gif', answer: '들리디스트로이' }, { file: '23.gif', answer: '첼릭버스' }, { file: '24.gif', answer: '드래곤터틀' },
        { file: '25.gif', answer: '알베르트' }, { file: '26.gif', answer: '타그래이' }, { file: '27.gif', answer: '잃은그레이' },
        { file: '28.gif', answer: '염된수액삐빅' }, { file: '29.gif', answer: '드릭체키스코' }, { file: '30.gif', answer: '주시하는' },
        { file: '31.gif', answer: '얼어불은고독' }, { file: '32.gif', answer: '이머파란버섯' }, { file: '33.gif', answer: '더키패밀' },
        { file: '34.gif', answer: '시약의피조' }, { file: '35.gif', answer: '장레옹모리' }, { file: '36.gif', answer: '에델슈타인게시' },
        { file: '37.gif', answer: '렉스라일라' }, { file: '38.gif', answer: '브라운테' }, { file: '39.gif', answer: '파르마엘리쟈' },
        { file: '40.gif', answer: '데들리아울' }, { file: '41.gif', answer: '로이스큰펭권' }, { file: '42.gif', answer: '비올레타유리관' },
        { file: '43.gif', answer: '불꽃의사' }, { file: '44.gif', answer: '들리디스트로이' }, { file: '45.gif', answer: '계의제단' },
        { file: '46.gif', answer: '시미아나뭇가지' }, { file: '47.gif', answer: '뒷골목의제이엠' }, { file: '48.gif', answer: '스텐노무쇠' },
        { file: '49.gif', answer: '벨루어벤제롬' }, { file: '50.gif', answer: '종자의수ha' }, { file: '51.gif', answer: '올리버겨대스콜' },
        { file: '52.gif', answer: '말수적은' }, { file: '53.gif', answer: '켈레톤밀리샤' }, { file: '54.gif', answer: '리스마스케이크' },
        { file: '55.gif', answer: '해시태그폰' }, { file: '56.gif', answer: '리프뚱뚱이라' }, { file: '57.gif', answer: '지시그너스하스' },
        { file: '58.gif', answer: '다크예티와' }, { file: '59.gif', answer: '자아스텀피' }, { file: '60.gif', answer: '령이깃든푸' },
        { file: '61.gif', answer: '밀라타우로마' }, { file: '62.gif', answer: '키누아리솔' }, { file: '63.gif', answer: '라솔빙하수토기' }, 
        { file: '64.gif', answer: '스타우로마시' }, { file: '65.gif', answer: '한에르다스' }, { file: '66.gif', answer: '시그너스' },
        { file: '67.gif', answer: '물갈색모래토끼' }, { file: '68.gif', answer: '크리스탈게이' }, { file: '69.gif', answer: '니쟁기소은월' },
        { file: '70.gif', answer: '강력한꽃덤불' }, { file: '71.gif', answer: '킨에반한겨울' }, { file: '72.gif', answer: '호문몽땅차크로' },
        { file: '73.gif', answer: '버스스켈레톤나' }, { file: '74.gif', answer: '어둠의집행자' }, { file: '75.gif', answer: '라이얀삼단지' },
        { file: '76.gif', answer: '비영웅을알아보' }, { file: '77.gif', answer: '스티온이카르트' }, { file: '78.gif', answer: '그릴스화' },
        { file: '79.gif', answer: '톤밀리샤' }, { file: '80.gif', answer: '나인하트' }, { file: '81.gif', answer: '트로이어' },
        { file: '82.gif', answer: '지그문트윌' }, { file: '83.gif', answer: '팜오베론' }, { file: '84.gif', answer: '콘트라베이스맨' },
        { file: '85.gif', answer: '마스터호브' }, { file: '86.gif', answer: '흥부모코' }, { file: '87.gif', answer: '옐로우불꽃마이' },
        { file: '88.gif', answer: '트러블메이커' }, { file: '89.gif', answer: '리관작은불씨' }, { file: '90.gif', answer: '스틸라장난감목' },
        { file: '91.gif', answer: '브리헤네' }, { file: '92.gif', answer: '테일의왼쪽머' }, { file: '93.gif', answer: '인매그너스' },
        { file: '94.gif', answer: '틱이계의사' }, { file: '95.gif', answer: '파파픽시아카이' }, { file: '96.gif', answer: '급닌자블록퍼스' },
        { file: '97.gif', answer: '니카울리카' }, { file: '98.gif', answer: '신스펙터' }, { file: '99.gif', answer: '칼라일혼돈' }
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
        btnHint.classList.add('hidden'); 
        consecutiveCorrects = 0; 
        updateScore(SCORE_TIMEOUT); 
        feedbackMessage.textContent = `⏰ HẾT GIỜ! Bạn bị trừ ${-SCORE_TIMEOUT} điểm. Chuỗi đúng bị RESET!`;
        
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

        // THAY ĐỔI ĐƯỜNG DẪN: Bỏ "img/"
        captchaImage.src = `${currentCaptcha.file}`;
        captchaImage.alt = `Captcha: ${currentCaptcha.file}`;
        captchaInput.value = ''; 
        captchaInput.focus();
        feedbackMessage.textContent = 'Hãy nhập đáp án...';
        
        btnHint.classList.add('hidden'); 
        startTimer();
    }
    
    // --- 4. Hàm Bắt đầu Trò chơi ---
    btnStart.addEventListener('click', () => {
        if (playerName === 'Khách') {
            alert('Vui lòng nhấn "Ghi Danh" và nhập tên trước khi bắt đầu trò chơi!');
            return;
        }
        
        score = 0;
        questionsAnswered = 0;
        consecutiveCorrects = 0; 
        updateScore(0);
        availableCaptchas = [...ALL_CAPTCHAS_DATA];
        
        gameArea.classList.remove('hidden');
        top10Area.classList.add('hidden');
        setRandomCaptcha();
    });

    // -----------------------------------------------------------------
    // --- 5. Hàm Lưu Top Score ONLINE (Firebase Firestore) ---
    // -----------------------------------------------------------------
    async function saveTopScoreOnline(name, finalScore) {
        if (finalScore <= 0 || !db) return; 

        const scoreRef = db.collection('top_scores').doc(name); 

        try {
            const doc = await scoreRef.get();
            let shouldUpdate = false;

            if (!doc.exists) {
                shouldUpdate = true;
            } else {
                const currentScore = doc.data().score;
                if (finalScore > currentScore) {
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                await scoreRef.set({
                    name: name,
                    score: finalScore,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log(`[Firebase]: Cập nhật điểm thành công cho ${name}: ${finalScore}`);
            } else {
                console.log(`[Firebase]: Điểm mới (${finalScore}) không cao hơn điểm cũ.`);
            }

        } catch (e) {
            console.error("[Firebase]: Lỗi khi lưu điểm:", e);
        }
    }
    // -----------------------------------------------------------------
    
    
    // --- 6. Hàm Kết thúc Trò chơi ---
    async function endGame() {
        clearInterval(timer);
        btnHint.classList.add('hidden');
        alert(`🎉 CHÚC MỪNG ${playerName}! Bạn đã hoàn thành ${MAX_QUESTIONS} câu hỏi với tổng điểm là: ${score}!`);
        
        await saveTopScoreOnline(playerName, score); 
        
        gameArea.classList.add('hidden');
        displayTop10Online(); 
    }

    // --- 7. Hàm Gửi Thông Báo Chuỗi Đúng ---
    async function sendOnlineNotification(name, currentScore, streak) {
        if (!db || streak < 10) return;
        
        const message = `${name} vừa đạt chuỗi ${streak} câu đúng liên tiếp! Tổng điểm: ${currentScore}.`;
        
        try {
            await db.collection('notifications').doc('latest').set({
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                streak: streak,
                name: name
            });
        } catch (e) {
            console.error("[Firebase]: Lỗi khi gửi thông báo online:", e);
        }
    }


    // --- 8. Kiểm tra Đáp án ---
    btnSubmit.addEventListener('click', () => {
        if (!currentCaptcha) {
             feedbackMessage.textContent = '❌ Hãy bấm "Bắt Đầu Trò Chơi"!';
             return;
        }
        
        clearInterval(timer);
        
        const userInput = captchaInput.value.trim();
        const correctAnswer = currentCaptcha.answer.trim();

        if (userInput === correctAnswer) {
            questionsAnswered++;
            consecutiveCorrects++;
            
            const timeBonus = timeLeft; 
            const streakBonus = consecutiveCorrects * 5; 
            const totalScoreChange = SCORE_CORRECT + timeBonus + streakBonus;
            
            updateScore(totalScoreChange); 
            
            feedbackMessage.innerHTML = `
                ✅ Chính xác! +${SCORE_CORRECT} điểm, +${timeBonus} điểm thưởng thời gian. 
                ${consecutiveCorrects > 1 ? `+${streakBonus} điểm thưởng chuỗi (${consecutiveCorrects}x)!` : ''} 
                Tổng cộng: +${totalScoreChange} điểm.
            `;
            
            if (consecutiveCorrects >= 10) {
                sendOnlineNotification(playerName, score, consecutiveCorrects);
            }
            
            btnHint.classList.add('hidden'); 
            
            if (questionsAnswered < MAX_QUESTIONS) {
                setTimeout(setRandomCaptcha, 1000); 
            } else {
                endGame();
            }
            
        } else {
            consecutiveCorrects = 0; 
            updateScore(SCORE_INCORRECT); 
            feedbackMessage.textContent = `❌ Sai rồi! Chuỗi đúng bị RESET! Bạn bị trừ ${-SCORE_INCORRECT} điểm. Thử lại hoặc Xem Đáp án.`;
            
            captchaInput.value = ''; 
            captchaInput.focus();
            
            btnHint.classList.remove('hidden'); 
            startTimer();
        }
    });
    
    // --- 9. Chức năng Xem Đáp án (Gợi ý) ---
    btnHint.addEventListener('click', () => {
        if (!currentCaptcha || score < -SCORE_HINT) { 
             alert('Bạn cần có ít nhất 100 điểm để xem đáp án!');
             return;
        }
        
        clearInterval(timer);
        consecutiveCorrects = 0; 
        updateScore(SCORE_HINT); 
        
        const correctAnswer = currentCaptcha.answer.trim();
        const userInput = captchaInput.value.trim(); 
        
        // HIỂN THỊ SO SÁNH ĐÁP ÁN
        feedbackMessage.innerHTML = `
            💡 ĐÁP ÁN ĐÚNG: "<strong>${correctAnswer}</strong>" <br>
            Bạn đã gõ: "<strong>${userInput}</strong>" <br>
            Bạn bị trừ ${-SCORE_HINT} điểm. Chuỗi đúng bị RESET! Chuyển câu sau 30 giây.
        `;
        
        captchaInput.value = correctAnswer;
        
        questionsAnswered++; 
        btnHint.classList.add('hidden'); 

        if (questionsAnswered < MAX_QUESTIONS) {
            // THAY ĐỔI THỜI GIAN CHỜ TỪ 3000ms (3s) LÊN 30000ms (30s)
            setTimeout(setRandomCaptcha, 30000); 
        } else {
            endGame(); 
        }
    });


    // Cho phép Enter để submit
    captchaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btnSubmit.click();
        }
    });

    // --- 10. Hàm Ghi Danh ---
    btnRegister.addEventListener('click', () => {
        const nameInput = prompt('Nhập tên người chơi của bạn (Tên sẽ dùng để lưu điểm):');
        if (nameInput && nameInput.trim() !== '') {
            playerName = nameInput.trim();
            playerNameSpan.textContent = playerName;
            alert(`Chào mừng, ${playerName}! Bạn đã sẵn sàng chơi!`);
        }
    });

    // -----------------------------------------------------------------
    // --- 11. Hàm Hiển thị Top 10 ONLINE (Firebase Firestore) ---
    // -----------------------------------------------------------------
    async function displayTop10Online() {
        if (!db) {
            top10List.innerHTML = '<li>Lỗi: Chưa kết nối được Firebase. Kiểm tra cấu hình trong index.html.</li>';
            return;
        } 

        top10List.innerHTML = '<li>Đang tải bảng xếp hạng...</li>';
        gameArea.classList.add('hidden');
        top10Area.classList.remove('hidden');

        try {
            const snapshot = await db.collection('top_scores')
                .orderBy('score', 'desc')
                .orderBy('timestamp', 'asc') 
                .limit(10)                  
                .get();

            let topScores = [];
            snapshot.forEach(doc => {
                topScores.push(doc.data());
            });

            top10List.innerHTML = ''; 

            if (topScores.length === 0) {
                top10List.innerHTML = '<li>Chưa có người chơi nào ghi điểm cao.</li>';
                return;
            }

            topScores.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>#${index + 1}</strong>: ${item.name} - <strong>${item.score}</strong> điểm`;
                top10List.appendChild(li);
            });

        } catch (e) {
            console.error("[Firebase]: Lỗi khi tải Top 10:", e);
            top10List.innerHTML = '<li>Lỗi kết nối Server. Vui lòng kiểm tra console.</li>';
        }
    }
    
    btnTop10.addEventListener('click', displayTop10Online);
    
    // -----------------------------------------------------------------
    // --- 12. Hàm Lắng Nghe Thông Báo Online ---
    // -----------------------------------------------------------------
    function setupOnlineNotificationListener() {
        if (!db) {
            onlineAnnouncementText.textContent = 'Lỗi kết nối Firebase.';
            return;
        }
        
        db.collection('notifications').doc('latest')
            .onSnapshot(doc => {
                const animationDuration = 10; 
                if (doc.exists) {
                    const data = doc.data();
                    const time = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() : 'Vừa rồi';
                    const message = `🌟 [ONLINE] ${data.message} (lúc ${time})`;
                    onlineAnnouncementText.textContent = message;
                    
                    onlineAnnouncementText.style.animation = `scroll-left ${animationDuration}s linear infinite`;
                    
                } else {
                    onlineAnnouncementText.textContent = '🎉 Chào mừng đến với Captcha Challenge! Hãy là người đầu tiên đạt 10 chuỗi đúng!';
                    onlineAnnouncementText.style.animation = `scroll-left ${animationDuration}s linear infinite`;
                }
            }, err => {
                console.error("[Firebase]: Lỗi lắng nghe thông báo:", err);
                onlineAnnouncementText.textContent = 'Lỗi kết nối thông báo online.';
                onlineAnnouncementText.style.animation = 'none';
            });
    }

    // -----------------------------------------------------------------
    // --- 13. KHỞI TẠO HIỆU ỨNG MƯA & Listener ---
    // -----------------------------------------------------------------
    function createRainEffect() {
        const container = document.querySelector('.rain-container');
        const numberOfDrops = 100;
        
        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement('div');
            drop.classList.add('rain-drop');
            
            drop.style.left = `${Math.random() * 100}%`;
            
            const duration = Math.random() * 1.2 + 0.8;
            drop.style.animationDuration = `${duration}s`;
            
            const delay = Math.random() * 2;
            drop.style.animationDelay = `-${delay}s`;
            
            const size = Math.random() * 20 + 20;
            drop.style.height = `${size}px`;
            
            drop.style.opacity = Math.random() * 0.5 + 0.3;

            container.appendChild(drop);
        }
    }

    createRainEffect();
    displayTop10Online();
    setupOnlineNotificationListener(); 
    
    questionCountSpan.textContent = `0/${MAX_QUESTIONS} (${TIME_LIMIT}s)`;
});
