import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onSuggestionSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const searchRef = useRef(null);

  const searchSuggestions = [
    {
      type: 'recent',
      items: ['Kathakali', 'Theyyam', 'Onam Festival', 'Mohiniyattam']
    },
    {
      type: 'popular',
      items: ['Kerala Classical Dance', 'Traditional Music', 'Folk Arts', 'Festival Celebrations']
    },
    {
      type: 'malayalam',
      items: [
        { term: 'കഥകളി', transliteration: 'Kathakali', meaning: 'Story Play' },
        { term: 'തെയ്യം', transliteration: 'Theyyam', meaning: 'Divine Form' },
        { term: 'മോഹിനിയാട്ടം', transliteration: 'Mohiniyattam', meaning: 'Dance of Enchantress' },
        { term: 'ഓണം', transliteration: 'Onam', meaning: 'Harvest Festival' }
      ]
    }
  ];

  const culturalGlossary = [
    { term: 'Mudra', meaning: 'Hand gestures in classical dance', category: 'Dance' },
    { term: 'Raga', meaning: 'Melodic framework in Indian music', category: 'Music' },
    { term: 'Tala', meaning: 'Rhythmic pattern in music and dance', category: 'Music' },
    { term: 'Abhinaya', meaning: 'Expression through dance and drama', category: 'Performance' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    setShowSuggestions(value?.length > 0);
    
    // Simulate Malayalam transliteration
    if (value?.length > 2 && /[a-zA-Z]/?.test(value)) {
      setIsTransliterating(true);
      setTimeout(() => setIsTransliterating(false), 500);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery?.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    onSearch(suggestion);
  };

  const handleMalayalamSuggestionClick = (item) => {
    setSearchQuery(item?.transliteration);
    setShowSuggestions(false);
    onSuggestionSelect?.(item?.transliteration);
    onSearch(item?.transliteration);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    onSearch('');
  };

  const filteredGlossary = culturalGlossary?.filter(item =>
    item?.term?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    item?.meaning?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search cultural content, Malayalam terms..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
            className="w-full pl-10 pr-20 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground placeholder-muted-foreground"
          />
          
          {/* Clear and Transliterate Buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {isTransliterating && (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
            )}
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Icon name="Search" size={16} />
            </Button>
          </div>
        </div>
      </form>
      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-warm-lg z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {searchSuggestions?.[0]?.items?.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Recent Searches
              </h4>
              <div className="space-y-1">
                {searchSuggestions?.[0]?.items?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full flex items-center px-2 py-1 text-sm text-popover-foreground hover:bg-muted rounded transition-colors text-left"
                  >
                    <Icon name="Clock" size={14} className="mr-2 text-muted-foreground" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-3 border-b border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Popular Topics
            </h4>
            <div className="space-y-1">
              {searchSuggestions?.[1]?.items?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full flex items-center px-2 py-1 text-sm text-popover-foreground hover:bg-muted rounded transition-colors text-left"
                >
                  <Icon name="TrendingUp" size={14} className="mr-2 text-muted-foreground" />
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Malayalam Terms */}
          <div className="p-3 border-b border-border">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Malayalam Terms
            </h4>
            <div className="space-y-2">
              {searchSuggestions?.[2]?.items?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMalayalamSuggestionClick(item)}
                  className="w-full flex items-start px-2 py-2 text-sm text-popover-foreground hover:bg-muted rounded transition-colors text-left"
                >
                  <Icon name="Languages" size={14} className="mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item?.term}</span>
                      <span className="text-muted-foreground">({item?.transliteration})</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item?.meaning}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cultural Glossary */}
          {filteredGlossary?.length > 0 && (
            <div className="p-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Cultural Glossary
              </h4>
              <div className="space-y-2">
                {filteredGlossary?.slice(0, 3)?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item?.term)}
                    className="w-full flex items-start px-2 py-2 text-sm text-popover-foreground hover:bg-muted rounded transition-colors text-left"
                  >
                    <Icon name="BookOpen" size={14} className="mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item?.term}</span>
                        <span className="px-1 py-0.5 bg-accent/20 text-accent text-xs rounded">
                          {item?.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item?.meaning}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;