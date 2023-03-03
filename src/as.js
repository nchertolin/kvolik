// useEffect(() => {
//   if (localStorage.getItem('token')) {
//     fetch(`${SERVER_URL}/api/account/`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         } else return response.json().then(text => { throw new Error(text.message) })
//       })
//       .then(data => {
//         setUser(data);
//         const rating = user.userRatings.filter(info => info.shortName === shortName)[0]?.grade;
//         if (rating !== undefined) {
//           fillStars(rating - 1);
//         }
//       })
//       .catch(err => console.error(err.message));
//   }
// }, [shortName]);