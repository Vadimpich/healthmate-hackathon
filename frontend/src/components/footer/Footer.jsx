import {Container} from 'react-bootstrap';
import './footer.css'

function Footer() {
    return (
        <footer className="text-light py-4">
            <Container className="text-center ">
                <div>
                    © 2024 HealthyMate. Все права защищены.
                </div>

            </Container>
        </footer>
    );
}

export default Footer;
