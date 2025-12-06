import React, {useState} from 'react'
import './ProductListing.css'
import { ProductItems as ProductItemViewList } from '/src/component/ProductItemViewList/ProductItemViewList'
import { SideBar } from '../../component/SideBar/SideBar'
import { emphasize, styled } from '@mui/material/styles';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

import { Home } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import { ProductItems } from '../../component/ProductItems/ProductItems';
import { IoGrid } from "react-icons/io5";
import { AiOutlineMenuUnfold } from "react-icons/ai";



export const ProductListing = () => {
  const [itemView, setItemView] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickSortBy = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseSortBy  = () => {
    setAnchorEl(null);
  };

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

  return (
    <section className='ProductListingSection'>
      <div className = 'BreadcrumbsWrapper'>
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›">
        <StyledBreadcrumb
          component="a"
          href="#"
          label="Home"
          icon={<Home fontSize="small" />}
        />
        <StyledBreadcrumb
          label="PC"
          deleteIcon={<ExpandMore />}
          onDelete={handleClick}
        />
          </Breadcrumbs>
        </div>
      </div>

      <div className='ProductListingContainer'>
          <div className='container'>
              <div className='SideBarWrapper-col1'>
                  <SideBar/>
            </div>
          
          <div className='SideBarWrapper-col2'>
            <div className='ProductListingSection-Header'>
              <div className='ProductListingSection-Header-Col1'>
                <Button className='Grid-Button'
                  onClick={() => setItemView('list')}><AiOutlineMenuUnfold />
                </Button>
                
                <Button className='Grid-Button'
                  onClick={() => setItemView('grid')}><IoGrid />
                </Button>

                <span className='Product-Count'> There are 12 products</span>
              </div>

              <div className='ProductListingSection-Header-Col2'> 
                <span className='Sort-By'> Sort by: </span>

                 <div>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickSortBy}
                    className='SortByButton'
                  >
                    Dashboard
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseSortBy}
                    slotProps={{
                      list: {
                        'aria-labelledby': 'basic-button',
                      },
                    }}
                  >
                    <MenuItem onClick={handleCloseSortBy}>Most Popular</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>Price: Increase</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>Price: Decrease</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>Name: A-Z</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>Name: Z-A</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>The Oldest</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>The Newest</MenuItem>
                    <MenuItem onClick={handleCloseSortBy}>Best Seller</MenuItem>
                  </Menu>
                </div>
                
              </div>
            </div>
            <div className={ itemView === 'grid' ? 'ProductListingSection-Content-Grid' : 'ProductListingSection-Content-List'}>
              {itemView === 'grid' ? (
                <>
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                  <ProductItems />
                </>
              ) : (
                   <>
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                  <ProductItemViewList />
                </>
              )}
            </div>
            <div className='ProductListing-Pagination'>
               <Pagination count={10} color="primary" showFirstButton showLastButton />
            </div>
          </div>
        </div>   
      </div>
    </section>
    
  )
}

export default ProductListing