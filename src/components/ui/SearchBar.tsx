import "./SearchBar.css"
import { Search } from "@mui/icons-material"


type SearchBarProps = {
  onSearch: (query:string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  variant?: "default" | "minimal" | "light";
  className?: string;
}

export const SearchBar = ({ 
  onSearch, 
  inputValue, 
  setInputValue,
  variant="default"
}: SearchBarProps) => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <form className={`search-bar ${variant}`}  onSubmit={handleSubmit}>
      <input 
        type="text"
        className="search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search subjct/email address"
        
      />
      <button type="submit" className="search-icon-button" >
        <Search />
      </button>
    </form>    
  );
}