import {Link} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [role, setRole] = useState('');

    //sending a request to api 
    async function registerUser(ev){
        ev.preventDefault();
        try {
            await axios.post('/register', {
                username,
                password,
                passwordConfirmation,
                name,
                surname,
                email,
                tel,
                role
            });
            alert('Registration successful. Now you can log in');
            // TO DO: if role == host : msg "Pending approval of your enrollment application as host."
            // TO DO: in any case, user can log in as 'tenant'.
        } catch (e) {
            alert('Registration failed. Please try again later');
        }  
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" 
                    placeholder="username" 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} />
                    <input type="password" 
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)} />
                    <input type="password" 
                    placeholder="password confirmation"
                    value={passwordConfirmation}
                    onChange={ev => setPasswordConfirmation(ev.target.value)} />
                    <input type="text" 
                    placeholder="name"
                    value={name}
                    onChange={ev => setName(ev.target.value)} />
                    <input type="text" 
                    placeholder="surname"
                    value={surname}
                    onChange={ev => setSurname(ev.target.value)} />
                    <input type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={ev => setEmail(ev.target.value)} />
                    <input type="tel" 
                    placeholder="mobile number"
                    value={tel}
                    onChange={ev => setTel(ev.target.value)} />
                    <input type="text" 
                    placeholder="role"
                    value={role}
                    onChange={ev => setRole(ev.target.value)} />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}