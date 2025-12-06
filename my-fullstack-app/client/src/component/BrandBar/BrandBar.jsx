import React from 'react';
import './BrandBar.css';

const logos = [
  { name: 'NVIDIA', url: 'https://www.nvidia.com/content/dam/en-zz/ja/Solutions/about-us/press-releases/Enterprise-jp-press-release-page-facebook-og-1200x630@2x.jpg' , link: 'https://www.nvidia.com/en-us/'},
  { name: 'Intel', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Intel_logo_2023.svg/2560px-Intel_logo_2023.svg.png', link: 'https://www.intel.com/content/www/us/en/homepage.html' },
  { name: 'AMD', url: 'https://cdn.thefpsreview.com/wp-content/uploads/2020/10/amd-logo-ruby-red-1024x576.jpg' , link: 'https://www.amd.com/en.html' },
  { name: 'MSI', url: 'https://cdn.dribbble.com/userupload/32582039/file/original-0e84db76fb44b5cbb82edeb60e4e3e16.png?resize=752x&vertical=center' , link: 'https://vn.msi.com/index.php'  },
  { name: 'Microsoft', url: 'https://blogs.microsoft.com/wp-content/uploads/prod/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen-1024x376.jpg'  , link: 'https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks' },
  { name: 'Gigabyte', url: 'https://1000logos.net/wp-content/uploads/2020/05/Gigabyte-Logo.png', link: 'https://www.gigabyte.com/'  },
  { name: 'FPT', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/FPT_Software_logo.svg/1200px-FPT_Software_logo.svg.png', link: 'https://fptsoftware.com/' },
  { name: 'Nintendo', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Nintendo_Switch_logo.svg/1200px-Nintendo_Switch_logo.svg.png', link: 'https://www.nintendo.com/us/' },
  { name: 'Sony Interactive Entertainment (SIE)', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Playstation_logo_colour_and_wordmark.png', link: 'https://sonyinteractive.com/en/' },
  { name: 'XBOX', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/XBOX_logo_2012.svg/1200px-XBOX_logo_2012.svg.png'  , link: 'https://www.xbox.com/en-US?xr=mebarnav' },
];

export const BrandBar = () => {
  const extendedLogos = [...logos, ...logos];

  return (
    <div className="infobar-container">
      <p className="infobar-title" data-text="TRUSTED BY TECHNOLOGY COMPANIES">
        TRUSTED BY TECHNOLOGY COMPANIES
      </p>
      <div className="infobar-scroller">
        <div className="infobar-track">
          {extendedLogos.map((logo, index) => (
            <div className="logo-item" key={index}>
              <a href={logo.link} target="_blank" rel="noopener noreferrer">
                <img src={logo.url} alt={`${logo.name} logo`} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandBar;