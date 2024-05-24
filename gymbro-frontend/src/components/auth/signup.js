import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
// import nodemailer from 'nodemailer'; // Поточно закоментовано, може бути використано для відправки листів з підтвердженням

// Компонент для сторінки реєстрації
export default function SignUpPage() {
    const [email, setEmail] = useState(""); // Стан для зберігання email
    const [password, setPassword] = useState(""); // Стан для зберігання пароля
    const [firstNameState, setFirstName] = useState(""); // Стан для зберігання імені користувача
    const [lastNameState, setLastName] = useState(""); // Стан для зберігання прізвища користувача
    const [error, setError] = useState(null); // Стан для зберігання помилки реєстрації
    const navigate = useNavigate(); // Функція для зміни маршруту

    // Функція для відправки запиту на реєстрацію
    async function handleRegister(e) {
        e.preventDefault(); // Зупиняємо стандартну поведінку форми
        try {
            setError(null); // Очищуємо попередню помилку
            // Відправляємо POST-запит на сервер для реєстрації
            const res = await axios.post(
                "https://localhost:3999/api/auth/signup",
                {
                    email,
                    password,
                    firstName: firstNameState,
                    lastName: lastNameState
                }
            );
            const { data } = res; // Отримуємо дані відповіді
            // Зберігаємо токен доступу в локальне сховище
            localStorage.setItem("access_token", data.access_token);
            console.log(localStorage.getItem("access_token"));
            navigate("/"); // Перенаправляємо користувача на головну сторінку після реєстрації
        } catch (err) {
            console.log(err); // Виводимо помилку в консоль
            // Отримуємо текст помилки з відповіді або звичайну помилку
            const errorMessage = err.response ? err.response.data.message : err.message;
            setError(errorMessage); // Встановлюємо помилку в стан
        }
    }

    // Функція для відправки електронного листа з підтвердженням (поточно закоментовано)
    function sendmail() {
        // Створення транспортера для відправки листів
        // const transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     auth: {
        //         user: 'gymbronotification@gmail.com',
        //         pass: 'yetvzowwyzprhnic',
        //     },
        // });

        // Опції для відправки листа
        // const mailOptions = {
        //     from: 'gymbronotification@gmail.com',
        //     to: 'valdaitsevv@mail.ru',
        //     subject: 'GymBro',
        //     text: 'Привіт, дякуємо за реєстрацію! Ласкаво просимо до команди GymBro. Успіхів у вашому тренуванні!',
        // };

        // Відправка листа
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log('Помилка при відправці листа:', error);
        //     } else {
        //         console.log('Лист успішно відправлено:', info.response);
        //     }
        // });
    }

    // Повертаємо рендеринг компонента
    return (
        <div className="container mt-4">
            <h1>Sign Up</h1>
            {/* Виводимо помилку, якщо вона є */}
            {
                (error && Array.isArray(error)) ?
                    error.map(err => (<p className="text-danger">{err}</p>)) :
                    <p className="text-danger">{error}</p>
            }
            {/* Форма для реєстрації */}
            <form onSubmit={handleRegister}>
                {/* Поле вводу для email */}
                <label>
                    Email
                    <input
                        className="form-control"
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
                    />
                </label>
                <br />
                {/* Поле вводу для імені */}
                <label>
                    First Name
                    <input
                        className="form-control"
                        type="text"
                        value={firstNameState}
                        onChange={e => setFirstName(e.target.value)}
                    />
                </label>
                <br />
                {/* Поле вводу для прізвища */}
                <label>
                    Last Name
                    <input
                        className="form-control"
                        type="text"
                        value={lastNameState}
                        onChange={e => setLastName(e.target.value)}
                    />
                </label>
                <br />
                <br />
                {/* Кнопка для відправки форми */}
                <button
                    className="btn btn-primary"
                    type="submit">
                    Sign Up
                </button>
                {/* Кнопка для переходу на сторінку входу */}
                <button
                    className="btn btn-secondary ms-3"
                    onClick={routeChange(`/signin`)}>
                    Already have an account?
                </button>
            </form>
        </div>
    );
}