import {Container} from 'react-bootstrap';
import './footer.css'
import {motion} from "framer-motion";

function Footer() {
    return (
        <footer className="text-light py-4">

            <div>
                <ul className={'no-bullets d-flex flex-row gap-5 justify-content-center'}>
                    <motion.li
                        whileHover={{scale: 1.05}}
                    ><a href={'https://t.me/vadimpich'} className={'text-decoration-none text-light'}>Вадим
                        Пичурин</a></motion.li>
                    <motion.li
                        whileHover={{scale: 1.05}}
                    ><a href={'https://t.me/Leranasiev'} className={'text-decoration-none text-light'}>Лера
                        Михеева</a></motion.li>
                    <motion.li
                        whileHover={{scale: 1.05}}
                    ><a href={'https://t.me/crescentsonata'} className={'text-decoration-none text-light'}>Надя
                        Бабасанова</a></motion.li>
                    <motion.li
                        whileHover={{scale: 1.05}}
                    ><a href={'https://t.me/bbbbbbtp'} className={'text-decoration-none text-light'}>Богдан
                        Топорин</a></motion.li>
                </ul>
            </div>
            <Container className="text-center ">
                <div>
                    © 2024 HealthyMate. Все права защищены.
                </div>

            </Container>
        </footer>
    );
}

export default Footer;
