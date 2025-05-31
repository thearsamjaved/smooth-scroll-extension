// Global variables for scroll control
let scrollController = null;

// Advanced scroll function with pause/resume functionality
function recordingScroll(options = {}) {
    const {
        duration = 90000,        
        startDelay = 200,       // Reduced default delay
        endPause = 2000,         
        easing = 'linear'
    } = options;
    
    const easings = {
        linear: t => t,
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    };
    
    let isAutoScrolling = false;
    let isPaused = false;
    let animationId = null;
    let startTime = null;
    let totalDistance = 0;
    let wheelTimeout = null;
    let isMouseDown = false;
    let originalDuration = duration;
    
    // Function to pause auto-scroll
    function pauseAutoScroll() {
        if (isAutoScrolling && !isPaused) {
            isPaused = true;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            console.log('Auto-scroll paused - manual control active');
        }
    }
    
    // Function to resume auto-scroll from current position
    function resumeAutoScroll() {
        if (isPaused && isAutoScrolling) {
            isPaused = false;
            
            // Calculate where we are now
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
            const fullPageDistance = document.body.scrollHeight - window.innerHeight;
            const remainingDistance = fullPageDistance - currentPosition;
            
            if (remainingDistance <= 0) {
                console.log('Already at bottom, stopping scroll');
                isAutoScrolling = false;
                removeEventListeners();
                chrome.runtime.sendMessage({action: 'scrollComplete'});
                return;
            }
            
            // Calculate remaining time to maintain consistent speed
            const adjustedDuration = (remainingDistance / fullPageDistance) * originalDuration;
            
            // Reset start time for remaining journey
            startTime = performance.now();
            
            // Start animation from current position
            animateFromCurrent(currentPosition, remainingDistance, adjustedDuration);
            console.log('Auto-scroll resumed from current position');
        }
    }
    
    // Animation function for resuming from current position
    function animateFromCurrent(startPos, distance, duration) {
        function animate(currentTime) {
            if (!isAutoScrolling || isPaused) return;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easings[easing](progress);
            
            const targetPosition = startPos + (distance * easedProgress);
            window.scrollTo(0, targetPosition);
            
            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                console.log('Scroll complete');
                isAutoScrolling = false;
                removeEventListeners();
                // Notify popup that scroll is complete
                chrome.runtime.sendMessage({action: 'scrollComplete'});
            }
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Handle mouse wheel events
    function handleWheel(e) {
        pauseAutoScroll();
        
        // Clear existing timeout
        if (wheelTimeout) {
            clearTimeout(wheelTimeout);
        }
        
        // Resume after 1 second of no wheel activity
        wheelTimeout = setTimeout(() => {
            resumeAutoScroll();
        }, 1000);
    }
    
    // Handle scrollbar dragging - mouse down
    function handleMouseDown(e) {
        // Check if click is likely on scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (e.clientX > window.innerWidth - scrollbarWidth - 20) {
            isMouseDown = true;
            pauseAutoScroll();
        }
    }
    
    // Handle scrollbar dragging - mouse up
    function handleMouseUp(e) {
        if (isMouseDown) {
            isMouseDown = false;
            // Resume after short delay
            setTimeout(() => {
                resumeAutoScroll();
            }, 300);
        }
    }
    
    // Handle touch events for mobile
    function handleTouchStart() {
        pauseAutoScroll();
    }
    
    function handleTouchEnd() {
        setTimeout(() => {
            resumeAutoScroll();
        }, 500);
    }
    
    // Initial animation function
    function animate(currentTime) {
        if (!isAutoScrolling || isPaused) return;
        
        if (!startTime) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / originalDuration, 1);
        const easedProgress = easings[easing](progress);
        
        const targetPosition = totalDistance * easedProgress;
        window.scrollTo(0, targetPosition);
        
        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            console.log('Scroll complete');
            isAutoScrolling = false;
            removeEventListeners();
            // Notify popup that scroll is complete
            chrome.runtime.sendMessage({action: 'scrollComplete'});
        }
    }
    
    // Add event listeners
    function addEventListeners() {
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Remove event listeners
    function removeEventListeners() {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        if (wheelTimeout) {
            clearTimeout(wheelTimeout);
        }
    }
    
    // Start the scroll from current position
    setTimeout(() => {
        const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const fullPageDistance = maxScroll; // Total page scroll distance
        const remainingDistance = maxScroll - currentPosition; // Remaining distance to scroll
        
        if (remainingDistance <= 0) {
            console.log('Already at bottom of page');
            return {
                stop: function() { console.log('Nothing to stop'); }
            };
        }
        
        // Calculate adjusted duration to maintain same speed
        // Speed = fullPageDistance / originalDuration
        // So for remaining distance: newDuration = remainingDistance / (fullPageDistance / originalDuration)
        const adjustedDuration = (remainingDistance / fullPageDistance) * originalDuration;
        
        totalDistance = remainingDistance;
        isAutoScrolling = true;
        
        // Store starting position for animation
        const startPosition = currentPosition;
        
        // Modified animate function to start from current position with adjusted duration
        function animateFromStart(currentTime) {
            if (!isAutoScrolling || isPaused) return;
            
            if (!startTime) startTime = currentTime;
            
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / adjustedDuration, 1);
            const easedProgress = easings[easing](progress);
            
            const targetPosition = startPosition + (totalDistance * easedProgress);
            window.scrollTo(0, targetPosition);
            
            if (progress < 1) {
                animationId = requestAnimationFrame(animateFromStart);
            } else {
                console.log('Scroll complete');
                isAutoScrolling = false;
                removeEventListeners();
                // Notify popup that scroll is complete
                chrome.runtime.sendMessage({action: 'scrollComplete'});
            }
        }
        
        addEventListeners();
        animateFromStart(performance.now());
        
        console.log(`Auto-scroll started from position ${currentPosition} - adjusted duration: ${adjustedDuration}ms to maintain consistent speed`);
        
    }, startDelay);
    
    // Return control object
    return {
        pause: pauseAutoScroll,
        resume: resumeAutoScroll,
        stop: function() {
            // Immediately stop all scrolling
            isAutoScrolling = false;
            isPaused = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            removeEventListeners();
            console.log('Auto-scroll stopped completely');
        }
    };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'startScroll') {
        // Stop any existing scroll
        if (scrollController) {
            scrollController.stop();
        }
        
        // Start new scroll with specified duration
        scrollController = recordingScroll({
            duration: request.duration,
            startDelay: 500,
            easing: 'linear'
        });
        
        console.log(`Starting scroll with duration: ${request.duration}ms`);
        sendResponse({status: 'started'});
        
    } else if (request.action === 'stopScroll') {
        if (scrollController) {
            scrollController.stop();
            scrollController = null;
        }
        console.log('Scroll stopped by user');
        sendResponse({status: 'stopped'});
    }
});