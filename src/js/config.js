let ApiUrl  = ""
if(window.serviceUrl){
    ApiUrl = window.serviceUrl;
} else {
    ApiUrl = window.getznerUrl;
}
export const serviceUrl = ApiUrl;
export const darcoPath = 'https://s3.ap-south-1.amazonaws.com/aws.tds/dam/darco/';
export const getznerTechFile = 'https://s3.ap-south-1.amazonaws.com/aws.tds/tds_getzner/technicalsheet/';
export const getznerPdf = 'https://s3.ap-south-1.amazonaws.com/aws.tds/tds_getzner/info/'
export const saasurl = 'https://sa.textronic.online/api';
export const getzner = {"sortby" : 'IsNameAsc',
    "featureAsLibrary" : ""
};
export const getznercf = {"sortby" : 'IsNameAsc',
    "featureAsLibrary" : ""
};
export const getznermtm = {"sortby" : 'IsNameAsc',
     "featureAsLibrary" : ""
};
export const getznertech = {"sortby" : 'IsNameAsc',
     "featureAsLibrary" : ""
};
