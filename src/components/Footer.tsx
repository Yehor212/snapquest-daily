import { Camera, Github, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                Photo<span className="text-gradient">Quest</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              Превращаем фотографию в игру. Ежедневные челленджи для креативных людей по всему миру.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Продукт</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Как это работает</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Тарифы</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Для мероприятий</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Для бизнеса</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Связаться</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Приватность</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Условия</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 PhotoQuest. Все права защищены.</p>
          <p>Сделано с ❤️ для креативных людей</p>
        </div>
      </div>
    </footer>
  );
};
