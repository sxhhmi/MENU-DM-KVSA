/* Data menu 4 minggu (sumber: JADUAL_MAKAN_ASRAMA.pdf).
   Format RAW: waktu makan dipisah ; hidangan dipisah | kalori selepas #.
   Kod: N=Nasi Putih B=Minuman Bermalta C=Susu Bercoklat M=Susu Bermalta T=Teh O K=Kopi O S=Air Soya */
const ANCHOR=Date.UTC(2026,10,16); // Isnin Minggu 1 (16 Nov 2026)
const DAYS=["Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu","Ahad"];
const MEALS=[["Sarapan Pagi","7:00 AM",7,9],["Makan Tengah Hari","1:00 PM",13,14.5],["Minum Petang","5:00 PM",17,18],["Makan Malam","8:00 PM",20,21.5],["Minum Malam","10:00 PM",22,23.5]];
const DR={B:"Minuman Bermalta",C:"Susu Bercoklat",M:"Susu Bermalta",T:"Teh O",K:"Kopi O",S:"Air Soya",N:"Nasi Putih"};
const TOT=[[2615,2495,2525,2535,2540,2535,2635],[2555,2545,2320,2640,2675,2715,2480],[2710,2575,2650,2585,2420,2650,2610],[2550,2505,2470,2525,2505,2435,2370]];
const RAW=[[
"Bihun Soto|Sambal Kicap|C;N|Ikan Tenggiri Asam Pedas|Sambal Goreng Jawa|Sayur Campur|Oren;Karipap Berinti Daging|T;Nasi Tomato (Beras Basmathi)|Ayam Goreng Rempah|Dalca|Papadom|Tembikai Merah;Mini Pizza|B#400 750 310 790 365",
"Nasi Goreng Kampung|B;N|Daging Masak Black Pepper|Tauhu Goreng Berlada|Kacang Buncis Goreng|Betik;Cucur Badak|M;N|Ikan Kembung Goreng Tepung|Sup Sayur|Jambu Batu;Sandwich Sardin|C#580 595 375 520 425",
"Bijirin Sarapan, Susu UHT dan Kismis|B;N|Ikan Selar Goreng|Sotong Goreng Kunyit|Labu Masak Lemak|Pisang Berangan;Pisang Goreng|C;Chicken Chop dan Sos Black Pepper|Coleslaw|Isi Jagung Kukus|Bun Kosong|Lai;Makaroni Goreng|S#530 610 410 585 440",
"Roti Bijirin Penuh dan Telur Hancur|Kacang Panggang|M;Nasi Ayam|Ayam Goreng|Sup Ayam|Sayur (Salad, Timun, Tomato)|Kuah Cili|Anggur;Muffin|T;N|Tenggiri Goreng Masak Kicap|Taugeh Goreng|Tembikai Susu;Roti Paun atau Benggali|Kari Ayam|B#565 740 310 550 370",
"Spaghetti Goreng|M;N|Ikan Bawal Goreng|Tom Yam Campur|Jambu Batu;Kuih Keria|C;N|Daging Masak Kicap|Kangkung Goreng|Epal Hijau;Egg Benjo|B#525 550 410 515 540",
"Nasi Impit|Rendang Daging|Kuah Kacang|B;N|Ikan Merah Masak Kari|Telur Dadar|Kacang Panjang dan Lobak Merah Goreng|Tembikai Susu;Cakoi dan Kaya|M;N|Sup Ayam|Sawi Putih Goreng|Epal Merah;Egg Benjo|B#520 640 385 590 400",
"Mi Goreng|M;N|Talapia Goreng Berlada|Sotong Goreng Kunyit|Pucuk Manis Masak Lemak|Tembikai Merah|Ais Krim Vanila;Masala Vadai|K;N|Ayam Masak Halia|Bayam Tumis Air|Pisang Berangan;Roti Canai dan Dalca|C#505 700 370 580 480"],[
"Nasi Goreng Cina|Telur Mata|T;N|Bawal Hitam Masak Taucu|Sup Sayur|Sambal Goreng Jawa|Betik;Karipap Pusing|B;N|Ayam Goreng Berempah|Sayur Campur|Sambal Belacan dan Ulam|Tembikai Susu;Sandwich Sardin|C#440 670 450 570 425",
"Roti Putih|Telur Hancur|Kacang Panggang|C;N|Sup Daging|Sotong Goreng Kunyit|Kangkung Goreng|Tembikai Merah;Cucur Udang|M;N|Ikan Tenggiri Masak Kari|Buncis, Taugeh dan Lobak Merah Goreng|Epal Hijau;Mi Hailam|B#480 540 505 540 480",
"Roti Canai dan Dalca|C;N|Rendang Daging|Telur Dadar|Sawi Putih Goreng|Anggur;Keledek Goreng|B;N|Ikan Siakap 3 Rasa|Kacang Panjang dan Lobak Merah Goreng|Pisang Berangan;Pau Kacang Merah|S#480 730 250 570 290",
"Bihun Goreng Putih|C;N|Daging Paprik|Sotong Goreng Bercili|Labu Air Masak Tumis|Jambu Batu;Kuih Kasturi|B;N|Ayam Masak Kicap|Kubis Goreng|Epal Merah;Roti Bun Kosong|Sup Ayam|M#540 700 340 645 415",
"Makaroni Goreng|B;Nasi Briyani (Beras Basmathi)|Ayam Tandoori Goreng|Dalca|Papadom|Tembikai Merah;Cucur Pisang|C;N|Ikan Merah Masak Sup|Kailan Goreng Belacan|Lai;Bubur Jagung|Roti Putih|K#460 845 440 560 370",
"Nasi Goreng Kampung|C;N|Ikan Kembung Goreng Kicap|Udang Sweet Sour|Kacang Buncis Goreng|Tembikai Susu;Kek Pisang|M;N|Ayam Goreng Masak Merah|Kubis Panjang Tumis Air dan Lobak Merah|Epal Hijau;Bihun Soto|Sambal Kicap|B#610 590 425 750 340",
"Nasi Lemak|B;N|Rendang Daging|Telur Dadar|Cendawan Tumis|Betik;Cucur Ikan Bilis|T;N|Udang Goreng Kunyit|Sawi Jepun Goreng|Oren;Sup Cendawan Berkrim|Roti Bijirin Penuh|C#640 760 190 500 410"],[
"Kuetiau Goreng|C;N|Ayam Masak Kari|Kacang Buncis Goreng|Sambal Goreng Jawa|Tembikai Susu;Karipap Sardin|K;N|Ikan Tenggiri Goreng Masak Kicap|Sayur Campur|Epal Hijau;Bubur Cha Cha|Biskut Krim Kraker|M#480 800 370 570 485",
"Nasi Goreng|B;N|Sup Daging|Udang Goreng Berempah|Betik;Masala Vadai|M;N|Ikan Tenggiri Masak Lemak Cili Api|Taugeh Goreng|Jambu Batu;Egg Benjo|C#520 505 455 700 570",
"Mi Goreng|C;Nasi Jagung|Ayam Goreng Masak Merah|Dalca|Papadom|Anggur;Ubi Kayu Rebus dan Sambal|M;Fish and Corn|Coleslaw|Isi Jagung Kukus|Bun Kosong|Oren;Mini Pizza|B#480 870 365 565 365",
"Bijirin Sarapan, Susu UHT dan Kismis|B;N|Ikan Selar Goreng|Udang Sweet Sour|Bayam Goreng|Lai;Muffin|T;Nasi Ayam|Ayam Goreng|Sup Ayam|Sayur (Salad, Timun, Tomato)|Kuah Cili|Tembikai Merah;Sup Cendawan Berkrim|Roti Bijirin Penuh|C#530 685 310 650 410",
"Spaghetti Bolognese|B;N|Daging Masak Kurma|Sotong Goreng Bercili|Kangkung Goreng|Betik;Apam Gula Hangus|M;N|Ikan Keli Goreng Berlada|Labu Masak Lemak|Pisang Berangan;Roti Canai dan Dalca|C#350 675 475 440 480",
"Nasi Impit|Rendang Daging|Kuah Kacang|M;N|Ikan Cencaru Goreng Sumbat Cili|Udang Goreng Kunyit|Kubis Masak Lemak|Jambu Batu|Ais Krim Coklat;Pau Goreng Sambal|C;N|Ayam Masak Kari|Buncis, Taugeh dan Lobak Merah Goreng|Epal Merah;Makaroni Goreng|K#555 755 400 610 330",
"Bihun Soto|Sambal Kicap|B;N|Ikan Selar Goreng|Sambal Udang|Tomyam Sayur|Tembikai Merah;Kek Coklat|M;Nasi Goreng|Ayam Goreng|Sup Sayur|Tembikai Susu;Sandwich Sardin|C#370 575 525 715 425"],[
"Roti Bijirin Penuh dan Telur Hancur|Kacang Panggang|C;N|Daging Masak Asam Pedas|Telur Dadar|Bayam Goreng|Anggur;Pau Kacang Merah|M;N|Ikan Siakap 3 Rasa|Kailan Goreng Belacan|Betik;Cucur Pisang|B#540 660 365 595 410",
"Bihun Goreng|C;N|Udang Masak Paprik|Sambal Goreng Jawa|Kangkung Goreng|Jambu Batu;Karipap Berinti Daging|T;N|Ayam Masak Kicap|Sayur Campur|Sambal Belacan dan Ulam|Oren;Roti Putih|Telur Hancur|S#510 665 310 640 380",
"Roti Canai dan Dalca|C;N|Ayam Goreng Berempah|Sambal Udang|Kubis Masak Lemak|Tembikai Susu;Keledek Goreng|M;N|Ikan Jenahak Masak Kari|Sawi Jepun Goreng Sos Tiram|Jambu Batu;Sandwich Sardin|B#480 710 305 580 395",
"Bubur Nasi|Sambal Cili Kicap|Sayur Kangkung Goreng|C;N|Ikan Tenggiri Goreng Kicap|Taugeh Goreng|Sambal Belacan dan Ulam|Tembikai Merah;Pulut Panggang|M;Nasi Briyani (Beras Basmathi)|Ayam Masak Kurma|Dalca|Papadom|Epal Hijau;Bubur Kacang Hijau|Biskut Krim Kraker|T#405 690 405 680 345",
"Nasi Lemak|C;Nasi Jagung|Ayam Goreng Masak Sambal|Sayur Campur|Tembikai Susu;Kuih Kasturi|M;N|Ikan Kembung Goreng Berlada|Sawi Putih Goreng|Betik;Roti Paun atau Benggali|Kari Ayam|B#670 600 395 610 370",
"Nasi Goreng Cendawan|C;N|Ikan Senangin Masak Kari|Udang Goreng Kunyit|Sawi Jepun Goreng|Betik;Kek Chiffon|M;N|Sup Ayam|Kubis Goreng|Epal Merah;Pau Ayam|B#560 550 495 540 290",
"Kuetiau Goreng|B;N|Ayam Masak Lemak Cili Api|Sambal Goreng Jawa|Kubis Goreng|Lai;Samosa|K;N|Ikan Kembung Masak Sambal|Kacang Panjang dan Lobak Merah Goreng|Pisang Berangan;Ban Manis|C#370 740 220 640 400"]];
