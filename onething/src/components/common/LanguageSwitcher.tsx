import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher">
      <FormControl size="small" variant="outlined">
        <Select
          value={i18n.language}
          onChange={handleChange}
          displayEmpty
          startAdornment={<TranslateIcon fontSize="small" style={{ marginRight: 8 }} />}
          sx={{
            minWidth: '120px',
            fontWeight: 500,
            '.MuiSelect-select': {
              padding: '8px 14px',
              paddingLeft: '8px',
            },
          }}
        >
          <MenuItem value="zh">中文</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ja">日本語</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default LanguageSwitcher; 