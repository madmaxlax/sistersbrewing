//Since there is no real backend (and none needed), this is just a 
//global var where a mongodb-like object is set up.

var beersDB = {
    queenbee:{
        name:"Queen Bee",
        urlName:'queenbee',
        shortDesc: "The Queen Bee is a delicious dry hopped IPA (7.7%) with a smooth citrus hoppy flavor.",
        longDesc: "Queen Bee is an India Pale Ale.\
\
India Pale Ale, abbreviated IPA is a style of beer within the category of Pale Ale. The beer was first brewed in England, destined for the London market in the 19th century. During the 17th century, England had many overseas colonies and the beer for the British soldiers and civilians was sent with ships to the other side of the world. A sailing vessel was on the road to India for nearly five months, far too long to keep normal beer. The English brewers in order to increase the shelf life of the beer, added more hops to the beer and increased the alcohol content of the beer. Hence, all the exported beer was heavily hopped, therefore was more bitter and higher in alcohol content. Thus India Ale, arose during the 18th century . India Pale Ale was created much later.\
\
IPA is a very popular craft beer and a beer to enjoy quietly and slowly.",
        artist: "Kiana Girigorie",
        artistUrl:"http://instagram.com/kiana.girigorie",
        backgroundColor: '#e3b9b6',
        labelImageUrl: './imgs/wide-label-queenbee.jpg',
        untappdId:'1232681',
        order: 1 
    },
    drone:{
        name:"Drone",
        urlName:'drone',
        shortDesc: "The Drone, our fantastic Porter (5.8%) has aromas of roasted malt, chocolate, caramel and coffee.",
        longDesc: 'Drone is a Porter.\
\
Porter is a type of dark beer, coming from London, it was first made during the 18th century. It is a derivative of brown beer, made from brown malt with a lot of hop. The beer is called Porter since it was very popular among the street and river porters. In 1802 the writer John Feltham wrote about the history of Porter, which was then used as the basis for most writings on this subject. However, there is very limited contemporary evidence on this version of the history of Porter. Feltham\'s story was based on a letter written by Obadiah Poundage (who for decades worked in the London brewing industry), in the 1760s. Feltham interpreted the text in a different way, most probably not correctly, because he was not familiar with the 18th century brewery terminology. He said that during the 18th century in London there was a popular drink called the "three threads". The three threads was made from a mixture of third of a pint of ale, beer and "twopenny" (the strongest beer, that costs two pence). Around 1730, wrote Feltham, there was a brewer called Harwood who brewed a beer called "Entire" which tasted very similar to the "three threads" which later was known as Porter. Porter is already mentioned in 1721, but only in Feltham\'s writing it states that this beer was made to create the "three threads". Instead, the beer seems to have evolved from the brown beer which was already brewed at that time in London. During 1700 beer brewers sold the beer when it was very young and it matured at the shop. Porter was the first beer that was already matured in the brewery and was ready to drink immediately. It was also the first beer that could be produced on a larger scale. A Porter is a full of flavor beer with lots of dark tones, one will often taste the chocolate flavor within.',
        artist: "Kiana Girigorie",
        artistUrl:"http://instagram.com/kiana.girigorie",
        backgroundColor: '#2ab8e8',
        labelImageUrl: './imgs/wide-label-drone.jpg',
        untappdId:'1234842',
        order: 2
    },
    honeyblonde:{
        name:"Honey Blonde",
        urlName:'honeyblonde',
        shortDesc: "ANice blonde beer, the Honey (7.9%) with notes of lemon, orange and star anise",
        longDesc: "Honey is a Blonde.\
\
A Blonde is a beer with a golden yellow colour. Basically is a Blonde beer a beer of high fermentation. The taste of the beer is generally smooth. The light malts have usually not such a distinct flavor, so the flavor comes from the hops and the yeast.",
        artist: "Luna Bongers",
        artistUrl:"http://instagram.com/Luna Bongers",
        backgroundColor: '#f1f0ed',
        labelImageUrl: './imgs/wide-label-honey.jpg',
        untappdId:'1372507',
        order: 3
    },
    worker:{
        name:"Worker",
        urlName:'worker',
        shortDesc: "Our tasty Imperial Saison, the Worker (9.4%), prickly sweet, over-ripe peaches, dates, stone fruit and the rye is very apparent and gives the beer a spicy floral taste.",
        longDesc: "Worker is an Imperial Saison.\
\
Saison is a Belgian type of beer (beer style) of top fermentation with an alcohol content of normally 5 to 6.5%. Saison is the French word for season because this is a seasonal beer. This beer was originally brewed in the winter by the farmers to be drunk by the seasonal workers in the harvest season. The Saison beer had to be brewed in the winter to prevent the beer would be bad during storage. Saison is originally a light, slightly acidic, dry (aftertaste), bitter, spicy/frutie beer, which was brewed during the winter to be drunk during the summer as a thirst quencher. Saisons are now brewed all year round.",
        artist: "Kiana Girigorie",
        artistUrl:"http://instagram.com/kiana.girigorie",
        backgroundColor: '#c0bbdc',
        labelImageUrl: './imgs/wide-label-worker.jpg',
        untappdId:'1372512',
        order: 4
    },
    smoker:{
        name:"Smoker",
        urlName:'smoker',
        shortDesc: "Smoker (5,4%), a subtle Rauchbier. Very clean smokiness with pleasant sweetness and complex flavours of the malt.",
        longDesc: "",
        artist: "Bernadette Leijdekkers",
        artistUrl:"http://www.leijdekkers.nl/",
        backgroundColor: '#31a2af',
        labelImageUrl: './imgs/wide-label-smoker.jpg',
        untappdId:'1549422',
        order: 5
    },
    hive:{
        new:true,
        name:"Hive",
        urlName:'hive',
        shortDesc: "New beer!",
        longDesc: "",
        artist: "Bernadette Leijdekkers",
        artistUrl:"http://www.leijdekkers.nl/",
        backgroundColor: '#d55f2a',
        labelImageUrl: './imgs/wide-label-hive.jpg',
        untappdId:'1572399',
        order: 6
    },
    drone2:{
        name:"Drone²",
        urlName:'drone2',
        shortDesc: "Drone² (8,5%), an Imperial version of the Drone. We increased the ingredients to get more aromas of roasted malt, chocolate, caramel and coffee!!!",
        longDesc: "",
        artist: "Kiana Girigorie",
        artistUrl:"http://instagram.com/kiana.girigorie",
        backgroundColor: '#339cd7',
        labelImageUrl: './imgs/wide-label-drone2.jpg',
        untappdId:'1549431',
        order: 7
    },
    nectar:{
        name:"Nectar",
        urlName:'nectar',
        shortDesc: "Nectar (10,7%), our Barleywine has a nice balance of malt and bitterness. The hops and malt work very well together.",
        longDesc: "",
        artist: "Cristiaan Lieverse",
        artistUrl:"http://www.christiaanlieverse.com/",
        backgroundColor: '#99a1b6',
        labelImageUrl: './imgs/wide-label-nectar.jpg',
        untappdId:'1549433',
        order: 8
    },
    abelha:{
        name:"Abelha",
        urlName:'abelha',
        new:true,
        shortDesc: "--",
        longDesc: "",
        artist: "  ",
        artistUrl:"",
        backgroundColor: '',
        labelImageUrl: './imgs/Abelha.jpg',
        untappdId:'1635987',
        order: 9
    },
    bzzz:{
        name:"Bzzz",
        urlName:'bzzz',
        new:true,
        shortDesc: "--",
        longDesc: "",
        artist: "  ",
        artistUrl:"",
        backgroundColor: '',
        labelImageUrl: './imgs/bzzz.jpg',
        untappdId:'1750801',
        order: 10
    }
    /*,
    newbeer:{
        name:"New Beer",
        shortDesc: "Short Desc",
        longDesc: "Long \
        desc",
        artist: "Kiana Girigorie",
        artistUrl:"http://instagram.com/kiana.girigorie",
        backgroundColor: 'light-green',
        labelImageUrl: 'beer.jpg',
        untappdId:'bid',
    },
    */

};