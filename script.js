document.addEventListener('DOMContentLoaded', () => {
    const widget = document.getElementById('iaMinicourseWidget');
    const lessonButtons = widget.querySelectorAll('.complete-lesson');
    const modules = widget.querySelectorAll('.module');
    const totalLessons = lessonButtons.length;
    const progressBarFill = widget.querySelector('.progress-fill');
    const progressText = widget.querySelector('.progress-text');
    const localStorageKey = 'iaMinicourseProgress';

    // --- Funções de Estado e Persistência ---

    // Carrega o estado do localStorage
    const loadProgress = () => {
        const savedProgress = localStorage.getItem(localStorageKey);
        return savedProgress ? JSON.parse(savedProgress) : {};
    };

    // Salva o estado no localStorage
    const saveProgress = (progress) => {
        localStorage.setItem(localStorageKey, JSON.stringify(progress));
    };

    let progressState = loadProgress();

    // --- Funções de Atualização de UI ---

    // Calcula e atualiza a barra de progresso
    const updateProgressBar = () => {
        const completedLessons = Object.values(progressState).filter(status => status).length;
        const percentage = (completedLessons / totalLessons) * 100;

        progressBarFill.style.width = `${percentage.toFixed(0)}%`;
        progressText.textContent = `${completedLessons} de ${totalLessons} Lições (${percentage.toFixed(0)}% Concluído)`;

        if (completedLessons === totalLessons) {
            showCompletionMessage();
        } else {
            removeCompletionMessage();
        }
    };

    // Aplica o estado salvo na UI
    const applySavedState = () => {
        lessonButtons.forEach(button => {
            const lessonId = button.dataset.lesson;
            const lessonElement = button.closest('.lesson');

            if (progressState[lessonId]) {
                lessonElement.classList.add('completed');
                button.textContent = 'Concluído!';
                button.disabled = true;
            }
        });
        updateProgressBar();
    };

    // Mostra a mensagem de conclusão
    const showCompletionMessage = () => {
        if (!widget.querySelector('.course-completed-message')) {
            const completionMessage = document.createElement('div');
            completionMessage.className = 'course-completed-message';
            completionMessage.innerHTML = '<h2>Parabéns! 🎉</h2><p>Você completou o Guia Essencial. Agora você está pronto para fazer uma escolha informada sobre seu curso de IA!</p>';
            widget.querySelector('.course-content').appendChild(completionMessage);
        }
    };

    // Remove a mensagem de conclusão
    const removeCompletionMessage = () => {
        const message = widget.querySelector('.course-completed-message');
        if (message) {
            message.remove();
        }
    };

    // --- Event Listeners ---

    // 1. Botões de Lição
    lessonButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const lessonId = event.target.dataset.lesson;
            const lessonElement = event.target.closest('.lesson');

            // Atualiza o estado
            progressState[lessonId] = true;
            saveProgress(progressState);

            // Atualiza a UI
            lessonElement.classList.add('completed');
            event.target.textContent = 'Concluído!';
            event.target.disabled = true;

            updateProgressBar();
        });
    });

    // 2. Acordeão dos Módulos
    modules.forEach(module => {
        const title = module.querySelector('.module-title');
        title.addEventListener('click', () => {
            // Fecha todos os outros módulos
            modules.forEach(m => {
                if (m !== module) {
                    m.classList.remove('open');
                }
            });
            // Alterna o módulo clicado
            module.classList.toggle('open');
        });
    });

    // Inicialização: Abre o primeiro módulo por padrão
    if (modules.length > 0) {
        modules[0].classList.add('open');
    }

    // Aplica o estado inicial
    applySavedState();
});
