import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import NavBar from "../shared/navbar-user";

// Отримання токену доступу до локального сховища
const accessToken = localStorage.getItem("access_token");

// Імпорт сокету з головного компоненту
import { socket } from '../../App'

/**
 * Компонент для сторінки "Домашня".
 * @component
 */
export default function HomePage() {
    const [user, setUser] = useState({});
    const [message, setMessage] = useState(null);
    const [routines, setRoutines] = useState([]);

    // Слухач подій з сокета
    socket.on('notify', (msg) => {
        console.log(msg)
        setMessage(msg);
    })

    let navigate = useNavigate();
    const changePathWorkout = routineId => {
        startWorkout(routineId)
            .then(res => {
                const { id } = res;
                navigate(`/workout/${id}`);
            });
    }

    const changePathNewRoutine = () => {
        navigate(`/create-routine`);
    }

    /**
     * Запуск тренування.
     * @param {string} routineId - Ідентифікатор рутиини.
     * @returns {Promise<Object>} - Об'єкт тренування.
     */
    async function startWorkout(routineId) {
        const res = await axios.post(
            `https://localhost:3999/api/workout/start`,
            {
                timeStart: new Date().toISOString(),
                routineId: routineId
            },
            {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        );
        const { data } = res;
        return data;
    }

    /**
     * Видалення рутиини.
     * @param {string} routineId - Ідентифікатор рутиини.
     */
    const deleteRoutine = routineId => {
        axios.delete(
            `https://localhost:3999/api/routine/delete/${routineId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
            setRoutines((prevRoutines) =>
                prevRoutines.filter((routine) => routine.id !== routineId)
            );
        }).catch(err => {
            console.log(err);
        })
    }

    /**
     * Отримання списку рутиин користувача та даних користувача при завантаженні компонента.
     */
    useEffect(() => {
        async function fetchRoutines() {
            const res = await axios.get(
                "https://localhost:3999/api/routine/get-all-by-user", {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            const { data } = res;
            setRoutines(data);
        }

        async function fetchUser() {
            const res = await axios.get(
                "https://localhost:3999/api/users/me", {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
            const { data } = res;
            setUser(data);
        }

        fetchUser();
        fetchRoutines();
    }, []);

    /**
     * Компонент для списку рутиин.
     * @param {Object} props - Властивості компонента.
     * @returns {JSX.Element} - JSX-елемент для відображення списку рутиин.
     */
    function RoutineList(props) {
        return (
            <div>
                {props.routines.map(routine => (
                    <div key={routine.id}>
                        <h3 className="mt-4">{routine.title}</h3>
                        <button
                            className="btn btn-dark"
                            onClick={() => changePathWorkout(routine.id)}>
                            Start Routine
                        </button>
                        <button
                            className="btn btn-secondary ms-2"
                            onClick={() => deleteRoutine(routine.id)}>
                            Delete Routine
                        </button>

                    </div>
                ))}
                <br />
                <button
                    className="btn btn-primary mt-3 fs-4"
                    onClick={changePathNewRoutine}>
                    Create new routine
                </button>
            </div>
        );
    }

    // Повернення рендерингу компонента
    return (
        <div>
            <NavBar user={user} />

            <h3 className="mt-4 container">
                Admin message:
                <h4 className="fs-4 text-info">{message ? message : "No messages yet"}</h4>
            </h3>
            <div className="container mt-4">
                <h1 className="mb-4">My Routines</h1>
                <RoutineList routines={routines} />
            </div>
        </div>
    );
}