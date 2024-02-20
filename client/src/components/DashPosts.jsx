import {  useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashPosts() {

  const[userPosts,setUserPosts]=useState([]);
  const [showMore,setShowMore]=useState(true);
  const {currentUser}=useSelector(state=>state.user);
  const [showModal,setShowModal]=useState(false);
  const [postToDelete,setShowPostToDelete]=useState('');
  // console.log(userPosts);

  const handleShowMore=async ()=>{
    const startIndex=userPosts.length ;
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts((prev)=>[...prev,...data.posts]);
          if(data.posts.length<9){
            setShowMore(false);
          }
        }
      }catch(err){
        console.log(err.message);
      }
  }

     useEffect(()=>{
              const fetchPosts = async()=>{
                  try{
                    const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                    const data = await res.json();
                    if(res.ok){
                      setUserPosts(data.posts);
                      if(data.posts.length<9){
                        setShowMore(false);
                      }
                    }

                  } catch(err){
                    console.log(err.message);

                  }  
              };
              if(currentUser.isAdmin){
                fetchPosts();
              }
     },[currentUser._id]);

     const handleDeletePost=async()=>{
       setShowModal(false);
       try{
        const res = await fetch(`/api/post/deletepost/${postToDelete}/${currentUser._id}`,{method:'DELETE'});
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
        }else{
          setUserPosts((prev)=>  prev.filter((post)=>post._id!==postToDelete)
          );
        }

       }catch(err){
         console.log(err.message);
       }
     }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
         {
          currentUser.isAdmin && userPosts.length > 0 ? (
              <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>
                    Number
                </Table.HeadCell>
                <Table.HeadCell>
                    Date updated
                </Table.HeadCell>
                <Table.HeadCell>
                    Post Image
                </Table.HeadCell>
                <Table.HeadCell>
                   Post Title
                </Table.HeadCell>
                <Table.HeadCell>
                   Category
                </Table.HeadCell>
                <Table.HeadCell>
                    Delete
                </Table.HeadCell>
                <Table.HeadCell>
                    <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
             {userPosts.map((post,index)=> ( 
              // console.log(post.slug),
             <Table.Body className=' divide-y' key={post._id}>
                <Table.Row className='bg-white dark: border-gray-700 dark:bg-gray-800'>  
               <Table.Cell>
                <p className='w-2 m-auto'>
                {index+1}
                </p>
               </Table.Cell>
         <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
         <Table.Cell>
<Link to={`/post/${post.slug}`}>
<img src={post.image} alt={post.title} 
className='w-20 h-20 object-cover bg-gray-500'
/>
</Link>
          </Table.Cell>
         <Table.Cell>
          <Link className=' font-medium text-gray-800 dark:text-white' to={`/post/${post.slug}`}>
          {post.title}
          </Link>
          </Table.Cell>
         <Table.Cell>
           {post.category}
          </Table.Cell>
             <Table.Cell>
               <span  onClick={()=>{setShowModal(true)
               setShowPostToDelete(post._id)
              }} className=' font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
             </Table.Cell>
             <Table.Cell>
                <Link className=' text-teal-500 hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                <span>Edit</span>
                </Link>
             </Table.Cell>
                </Table.Row>

               </Table.Body>

))}
            </Table>
            {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-medium py-7'
            >
              Show more
            </button>
          )}
            </>
          ) :(
            <p> {'You Have not posts yet'}</p>
          )
         }
         <Modal 
         show={showModal}
         onClose={()=>setShowModal(false)}
         popup
         size='md'
         >
          <Modal.Header />
          <Modal.Body>
       <div className='text-center'>
       <HiOutlineExclamationCircle className='h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto' />
       <h3  className='mb-5 text-lg text-gray-500 dark:to-gray-400' >Are you sure want to delete this post  </h3>
       <div className='flex justify-center gap-4' >
      <Button color='failure' onClick={handleDeletePost}>Yes I'am sure</Button>
      <Button onClick={()=>setShowModal(false)} color='gray'> No , cancel
      </Button>
       </div>
       </div>
          </Modal.Body>
         </Modal>
         
    </div>
  )
}
