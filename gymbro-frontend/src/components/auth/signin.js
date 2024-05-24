import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

// Компонент для сторінки входу
export default function SignInPage() {
    const [email, setEmail] = useState(""); // Стан для зберігання email
    const [password, setPassword] = useState(""); // Стан для зберігання пароля
    const [error, setError] = useState(null); // Стан для зберігання помилки входу
    const navigate = useNavigate(); // Функція для зміни маршруту
    /**
     * Форматує час в секундах у вигляді хвилин і секунд.
     * @e {number} seconds - Кількість секунд.
     */
    async function handleLogin(e) {
        e.preventDefault(); // Зупиняємо стандартну поведінку форми
        try {
            setError(null); // Очищуємо попередню помилку
            // Відправляємо POST-запит на сервер для аутентифікації
            const res = await axios.post(
                "https://localhost:3999/api/auth/signin",
                {
                    email,
                    password
                }
            );
            const { data } = res; // Отримуємо дані відповіді
            // Зберігаємо токен доступу в локальне сховище
            localStorage.setItem("access_token", data.access_token);
            // Отримуємо дані про користувача після успішного входу
            const userRes = await axios.get("https://localhost:3999/api/users/me", {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                },
            });
            // Встановлюємо дані користувача в стан
            setUser(userRes.data);
            // Отримуємо дані про роль користувача
            const roleRes = await axios.get(`https://localhost:3999/api/role/get-by-id/${userRes.data.roleId}`, {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                },
            });
            // Встановлюємо роль користувача в стан
            setRole(roleRes.data);
            // Перенаправляємо користувача на відповідну сторінку залежно від ролі
            if (role) {
                if (role.name === 'ADMIN')
                    navigate('/admin');
                else
                    navigate('/home');
            }
        } catch (err) {
            console.log(err); // Виводимо помилку в консоль
            // Отримуємо текст помилки з відповіді або звичайну помилку
            const errorMessage = err.response ? err.response.data.message : err.message;
            setError(errorMessage); // Встановлюємо помилку в стан
        }
    }

    // Повертаємо рендеринг компонента
    return (
        <div className="container mt-4">
            <h1>Sign In</h1>
            {/* Виводимо помилку, якщо вона є */}
            {
                (error && Array.isArray(error)) ?
                    error.map(err => (<p className="text-danger">{err}</p>)) :
                    <p className="text-danger">{error}</p>
            }
            {/* Форма для входу */}
            <form onSubmit={handleLogin}>
                <div>
                    {/* Поле вводу для email */}
                    <label>
                        Email
                        <input
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    {/* Поле вводу для пароля */}
                    <label>
                        Password
                        <input
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <br />
                    {/* Кнопка для відправки форми */}
                    <button
                        className="btn btn-primary"
                        type="submit">
                        Sign In
                    </button>
                    {/* Кнопка для переходу на сторінку реєстрації */}
                    <button
                        className="btn btn-secondary ms-3"
                        onClick={routeChange(`/signup`)}>
                        Create new account
                    </button>
                </div>
            </form>
        </div>
    );
}