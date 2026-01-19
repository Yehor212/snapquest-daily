import { Camera, Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Snap<span className="text-gradient">Quest</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Превращаем фотографию в игру. Ежедневные челленджи для креативных людей по всему миру.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Yehor212/snapquest-daily"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Продукт</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/hunts" className="hover:text-foreground transition-colors">Как это работает</Link></li>
              <li><Link to="/generator" className="hover:text-foreground transition-colors">Генератор</Link></li>
              <li><Link to="/events" className="hover:text-foreground transition-colors">Для мероприятий</Link></li>
              <li><Link to="/events/create" className="hover:text-foreground transition-colors">Создать событие</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ресурсы</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/gallery" className="hover:text-foreground transition-colors">Галерея</Link></li>
              <li><Link to="/profile" className="hover:text-foreground transition-colors">Профиль</Link></li>
              <li><Link to="/upload" className="hover:text-foreground transition-colors">Загрузить фото</Link></li>
              <li>
                <a
                  href="https://github.com/Yehor212/snapquest-daily/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Обратная связь
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} SnapQuest. Все права защищены.</p>
          <p>Сделано с ❤️ для креативных людей</p>
        </div>
      </div>
    </footer>
  );
};
