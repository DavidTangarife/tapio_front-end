import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { EmailPaginationProps } from '../../types/types';

const EmailPagination: React.FC<EmailPaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Stack spacing={2} >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
   
        siblingCount={1} 
        boundaryCount={1} 
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#f5f5f5',
            borderColor: 'transparent',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            // backgroundColor: '#1f1f1f',
            color: '#f5f5f5',
            borderColor: '#86dd14',
          },
        }}
      />
   </Stack>
  );
};

export default EmailPagination;
