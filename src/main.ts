import './style.css'
import { Game } from './classes/Game'

// Nettoyer le contenu existant
document.querySelector<HTMLDivElement>('#app')!.innerHTML = ''

// Démarrer le jeu
window.onload = () => {
    const game = new Game();
    game.start();
}
