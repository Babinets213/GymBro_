import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import NavBarAdmin from "../shared/navbar-admin";
const accessToken = localStorage.getItem("access_token");

// Компонент для сторінки оновлення вправи
export default function UpdateExercise() {
    const [exercise, setExercise] = useState(null); // Стан для зберігання вправи
    const [name, setName] = useState(""); // Стан для зберігання назви вправи
    const [image, setImage] = useState(null); // Стан для зберігання зображення вправи (поточно не використовується)
    const [technique, setTechnique] = useState(""); // Стан для зберігання техніки виконання вправи
    const [muscleGroups, setMuscleGroups] = useState([]); // Стан для зберігання груп м'язів
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(""); // Стан для зберігання обраної групи м'язів
    const [error, setError] = useState(null); // Стан для зберігання помилки

    // Отримання ідентифікатора вправи з URL
    const exerciseId = window.location.href.split('/')[6];

    // Виконання ефектів після монтажу компонента
    useEffect(() => {
        fetchMuscleGroups(); // Отримання груп м'язів
        fetchExercise(); // Отримання вправи
    }, []);

    // Функція для отримання груп м'язів
    const fetchMuscleGroups = async () => {
        try {
            const response = await axios.get("https://localhost:3999/api/muscle-group/get-all", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setMuscleGroups(response.data);
        } catch (err) {
            console.log(err);
            const errorMessage = err.response ? err.response.data.message : err.message;
            setError(errorMessage);
        }
    };

    // Функція для отримання вправи за ідентифікатором
    const fetchExercise = async () => {
        try {
            const response = await axios.get(`https://localhost:3999/api/exercise/get-by-id/${exerciseId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setExercise(response.data);
            setName(response.data.name);
            setTechnique(response.data.technique);
            setSelectedMuscleGroup(response.data.muscleGroupId);
        } catch (err) {
            console.log(err);
            const errorMessage = err.response ? err.response.data.message : err.message;
            setError(errorMessage);
        }
    };

    // Обробник подання форми
    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Зупиняємо стандартну поведінку форми
        try {
            setError(null); // Очищуємо попередню помилку
            // Відправляємо PUT-запит на сервер для оновлення вправи
            await axios.put(`https://localhost:3999/api/exercise/update/${exerciseId}`,
                {
                    name: name,
                    image: "", // Поточно не використовується
                    technique: technique,
                    muscleGroupId: selectedMuscleGroup
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

            // Очищаємо дані форми
            setName("");
            setImage(null);
            setTechnique("");
            setSelectedMuscleGroup("");

            // Перенаправляємо користувача на сторінку адміністратора
            navigate(`/admin`);
        } catch (err) {
            console.log(err);
            const errorMessage = err.response ? err.response.data.message : err.message;
            setError(errorMessage);
        }
    };

    // Функція для відміни та повернення на сторінку адміністратора
    const navigate = useNavigate();
    function dismiss() {
        navigate(`/admin`);
    }

    // Повертаємо рендеринг компонента
    return (
        <div>
            <NavBarAdmin /> {/* Компонент навігації адміністратора */}
            <div className="container mt-5" style={{ "width": "30%" }}>
                <h1>Update Exercise</h1>
                <form onSubmit={handleFormSubmit}>
                    {/* Поле вводу для назви вправи */}
                    {error ?
                        (
                            <div className="form-group has-danger">
                                <label className="form-label">Name:</label>
                                <input className="form-control is-invalid" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                <div className="invalid-feedback">{error}</div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Name:</label>
                                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        )}

                    {/* Поле вводу для техніки виконання */}
                    <div className="form-group mt-3">
                        <label className="form-label">Technique:</label>
                        <input className="form-control" type="text" value={technique} onChange={(e) => setTechnique(e.target.value)} />
                    </div>
                    {/* Випадаючий список для обраної групи м'язів */}
                    <div className="form-group mt-3">
                        <label className="form-label">Muscle Group:</label>
                        <select className="form-select" value={selectedMuscleGroup} onChange={(e) => setSelectedMuscleGroup(e.target.value)} required>
                            <option value="">Select Muscle Group</option>
                            {/* Відображення варіантів груп м'язів */}
                            {muscleGroups.map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Кнопка для оновлення вправи */}
                    <button className="btn btn-info btn-lg mt-3" type="submit" >Update Exercise</button>
                    {/* Кнопка для відміни та повернення на сторінку адміністратора */}
                    <button className="btn btn-secondary btn-lg mt-3 ms-3" onClick={dismiss}>Dismiss</button>
                </form>
            </div>
        </div>
    );
};