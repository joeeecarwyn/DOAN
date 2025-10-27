// auth-manager.js
class AuthManager {
    static init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.updateCartCount(); // Cập nhật giỏ hàng
    }

    static checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const guestActions = document.getElementById('guestActions');
        const userActions = document.getElementById('userActions');
        const userName = document.getElementById('userName');

        if (currentUser) {
            // Đã đăng nhập
            if (guestActions) guestActions.style.display = 'none';
            if (userActions) userActions.style.display = 'flex';
            if (userName) userName.textContent = currentUser.name || currentUser.email.split('@')[0];
        } else {
            // Chưa đăng nhập
            if (guestActions) guestActions.style.display = 'flex';
            if (userActions) userActions.style.display = 'none';
        }
    }

    static login(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.checkLoginStatus();
        this.showNotification('Đăng nhập thành công!');
        
        // Chuyển hướng về trang chủ sau 1 giây
        setTimeout(() => {
            if (!window.location.pathname.includes('index.html')) {
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    static logout() {
        localStorage.removeItem('currentUser');
        this.checkLoginStatus();
        this.showNotification('Đã đăng xuất');
        
        // Chuyển hướng về trang chủ sau 1 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static isLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    static setupEventListeners() {
        // Xử lý đăng xuất
        document.addEventListener('click', function(e) {
            if (e.target.closest('#logout-btn')) {
                e.preventDefault();
                if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    AuthManager.logout();
                }
            }
        });

        // Xử lý form đăng nhập nếu có trên trang
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (email && password) {
                    const userData = {
                        id: Date.now(),
                        name: email.split('@')[0],
                        email: email,
                        loginTime: new Date().toISOString()
                    };
                    
                    AuthManager.login(userData);
                } else {
                    AuthManager.showNotification('Vui lòng nhập đầy đủ thông tin');
                }
            });
        }

        // Xử lý form đăng ký nếu có trên trang
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const fullName = document.getElementById('fullName').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    AuthManager.showNotification('Mật khẩu xác nhận không khớp');
                    return;
                }
                
                if (fullName && email && password) {
                    const userData = {
                        id: Date.now(),
                        name: fullName,
                        email: email,
                        loginTime: new Date().toISOString()
                    };
                    
                    AuthManager.login(userData);
                } else {
                    AuthManager.showNotification('Vui lòng nhập đầy đủ thông tin');
                }
            });
        }
    }

    static updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });
    }

    static showNotification(message) {
        let notification = document.getElementById('notification');
        let notificationText = document.getElementById('notificationText') || document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        } else {
            // Fallback: sử dụng alert
            alert(message);
        }
    }
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.init();
});