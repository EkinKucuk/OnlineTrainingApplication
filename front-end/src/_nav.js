import config from './config'

const nav = [
  {
    name: 'PANEL',
    url: '/dashboard',
    icon: 'icon-speedometer',
    
  },
  {
    name: 'Kullanıcı Bilgileri',
    url: '/kullanıcı',
    icon: 'icon-user',
    
  },
  
]

if (localStorage.getItem('permissions').includes(config.permissionTypes.participate_course)){
  nav.push(

    {
      name: 'Açık Kurslar',
      url: '/tumacikkurslar',
      icon: 'icon-pencil',
    },
  )
}

if (localStorage.getItem('permissions').includes(config.permissionTypes.crud_operations)){
  nav.push(
    {
      title: true,
      name: 'Kullanıcı İşlemlerİ ',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Kullanıcı Yarat',
      url: '/kullanıcıyarat',
      icon: 'icon-drop',
    },
    {
      name: 'Kullanıcıları Düzenle',
      url: '/kullanıcıdüzenle',
      icon: 'icon-pencil',
    },
  )
}


if(localStorage.getItem('permissions').includes(config.permissionTypes.create_course)){
  nav.push(
    {
      title: true,
      name: 'KURS İŞLEMLERİ',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Kurs Yarat',
      url: '/kursyarat',
      icon: 'icon-puzzle',
      
    },
    {
      name: 'Tüm Kursları Düzenle',
      url: '/kursdüzenle',
      icon: 'icon-cursor',
      
    },
  
    {
      name: 'Kurs Tiplerini Düzenle',
      url: '/kurstipleri',
      icon: 'icon-star',
    }
  )
}

if(localStorage.getItem('permissions').includes(config.permissionTypes.manage_course)){
  nav.push(
    {
      title: true,
      name: 'Kurslarım',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Kurslarımı Düzenle',
      url: '/kurslarımidüzenle',
      icon: 'icon-cursor',
      
    },
  
  )
}

if(localStorage.getItem('permissions').includes(config.permissionTypes.crud_operations)){
  nav.push(
    {
      title: true,
      name: 'Rol İşlemleri',
    },
  
    {
      name: 'Rol Yarat',
      url: '/rolyarat',
      icon: 'icon-star',
    },
  
    {
      name: 'Rolleri Düzenle',
      url: '/roldüzenle',
      icon: 'icon-star',
    },
  
    
    {
      name: 'Rol Ata',
      url: '/rolata',
      icon: 'icon-star',
    },

    {
      name: "Role'e Yetki Ata",
      url: '/rolyetkisiata',
      icon: 'icon-star',
    },
  )
}


export default {
  items: nav
};