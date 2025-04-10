import React,{useState, useEffect, useContext, useRef} from 'react';
import { Button, Modal, Dropdown, Nav, Tab, Table, ListGroup } from 'react-bootstrap';
import { Card, Form, InputGroup } from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { baseURL_ } from '../../config'
import moment from 'moment';
import {startOfMonth, isWeekend, isBefore} from 'date-fns'
import { Logout } from '../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/AxiosInstance';
import ReactApexChart from 'react-apexcharts';
import { translations } from './Reportstranslation';
import { Select } from 'semantic-ui-react';


const ticketData = [
    {number:"01", emplid:"Emp-0852", count:'3'},
    {number:"02", emplid:"Emp-2052", count:'5'},
    {number:"03", emplid:"Emp-3052", count:'9'},
    {number:"04", emplid:"Emp-3055", count:'8'},
    {number:"05", emplid:"Emp-1052", count:'6'},
    {number:"06", emplid:"Emp-3055", count:'1'},
    {number:"07", emplid:"Emp-3052", count:'4'},
];

const Reports = ({language,country}) => {

    const {type} = useParams()
    const navigate = useNavigate()
	const dispatch = useDispatch()
    // const [dailyData, setDailyData] = useState({ cassiterite: [], coltan: [], wolframite: [] });
    const access = localStorage.getItem(`_dash`) || '3ts'
    const [attachment, setattachment] = useState()
    const [loading, setLoading] = useState(false);
    const [companies, setcompanies] = useState([]);
    const [suppliers, setsuppliers] = useState([]);
    const [company, setcompany] = useState()
    const [mineral, setmineral] = useState();
    const [exportationid,setExportationid]=useState([]);
    const [timeData, setTimeData] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [suppliertrend,setsuppliertrend]=useState();
    const [timePage, setTimePage] = useState(1);
    const [kycSummary, setKycSummary] = useState({});
    const [kycLoading, setKycLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentKycPage, setCurrentKycPage] = useState(1);
    const kycItemsPerPage = 5; // Display 5 items per page
    const [trendData, setTrendData] = useState({

        Cassiterite: [],
        Coltan: [],
        Wolframite: []
    });
    //for Testing 
    const [defaultTrendData, setDefaultTrendData] = useState({
        Cassiterite: [],
        Coltan: [],
        Wolframite: [],
        totalVolume: 0
    });
    const [filteredTrendData, setFilteredTrendData] = useState({
        Cassiterite: [],
        Coltan: [],
        Wolframite: [],
        totalVolume: 0
    });
    const [yearFilterApplied, setYearFilterApplied] = useState(false);
    //end for Testing
    const [trace, settrace] = useState({
        production: [],
        bags: [],
        blending: {
            header: [],
            rows: []
        },
        drums: [],
        bags_proc: [],
        processing: [],
        exports: []
    })

    const [sale,setSale]=useState({
        sale_Report:[],
        totalValue:0,
    })
    const [appliedsale,setAppliedSale]=useState({
        sale_Report:[],
        totalValue:0
    })
    const [rangeapplied,setRangeApplied]=useState(false);

    const [exportsPage, setexportsPage] = useState(1)
    const [drumsPage, setdrumsPage] = useState(1)
    const [prodPage, setprodPage] = useState(1)
    const [procPage, setprocPage] = useState(1)
    const [bagsPage, setbagsPage] = useState(1)
    const [salesPage, setsalesPage] = useState(1)
    
    const [bagsProcPage, setbagsProcPage] = useState(1)
    const { changeTitle } = useContext(ThemeContext)
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
    let days = 0
    for (let date = startOfMonth(new Date()); isBefore(date, new Date()); date = moment(date).add(1, "day").toDate()) {
        if(!isWeekend(date)){
            days++
        }
    }
    const t = (key) => {
        if (!translations[language]) {
          console.warn(`Translation for language "${language}" not found`);
          return key;
        }
        return translations[language][key] || key;
      };
    const [daily, setdaily] = useState({
        cassiterite: {
            dailyTarget: 4.76,
            dailyActual: 0,
            mtdTarget: 100,
            mtdActual: 0,
        },
        coltan: {
            dailyTarget: 0.38,
            dailyActual: 0,
            mtdTarget: 8,
            mtdActual: 0,
        },
        wolframite: {
            dailyTarget: 0.19,
            dailyActual: 0,
            mtdTarget: 4,
            mtdActual: 0,
          }
    })
    // const t = (key) => {
    //     if (!translations[language]) {
    //       console.warn(`Translation for language "${language}" not found`);
    //       return key;
    //     }
    //     return translations[language][key] || key;
    //   };
    const[monthly,setMonthly]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        }


    });
    const[monthlypurchase,setMonthlyPurchase]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        }


    })
    const [balance, setbalance] = useState({
        cassiterite: {
          
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        },
        coltan: {
           
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        },
        wolframite: {
           
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        }
    })

    const [deliveries, setdeliveries] = useState({
        cassiterite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        coltan: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        wolframite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        }
    })
	const sort = 20;
	const activePag = useRef(0);
	const user = JSON.parse(localStorage.getItem(`_authUsr`))

	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};

    const showAttachment  = (file, field)=>{
        axiosInstance.post(`${baseURL_}image`, {
            file
        }).then(response=>{
            setattachment({image: response.data.image, field})
            //this is incase the view permission was not granted before
            setTimeout(()=>{
                setattachment({image: response.data.image, field})
            }, 5000)
        }).catch(err=>{
            try{
                if(err.response.code === 403){
                    dispatch(Logout(navigate))
                }else{
                    toast.warn(err.response.message)
                }
            }catch(e){
                toast.error(err.message)
            }
        })
    }

    const changeCompany = (e)=>{
        const input = e.currentTarget.value
        if(input === 'Select Company'){
            setcompany(null)
            return toast.warn("Please select a company to generate trace report for.")
        }
        const selected = JSON.parse(input);
        setcompany(selected)
        toast.info('Generating trace report, please wait...', {
            delay: 100,
            autoClose: true
        })
    }
    const changeMineral = (e)=>{
        const input = e.currentTarget.value
        if(input === 'Select Mineral'){
            setmineral(null)
            return toast.warn("Please select a Mineral to generate Sales report for.")
        }
        const selected = input;
        setmineral(selected)
        toast.info('Generating Sales report, please wait...', {
            delay: 100,
            autoClose: true
        })
    }
    // Your select onChange handler
                const changesuppliertrends = (e) => {
                    if (e.target.value === t("SelectCompanyShort")) {
                    // Clear selection
                    setsuppliertrend(null);
                    return;
                    }
                    
                    try {
                    // Parse the JSON string back to an object
                    const selectedSupplier = JSON.parse(e.target.value);
                    //console.log("Selected supplier:", selectedSupplier);
                    
                    // Set the supplier trend with the parsed object
                    setsuppliertrend(selectedSupplier);
                    toast.info('Generating Sales report, please wait...', {
                        delay: 100,
                        autoClose: true
                    })
                    } catch (error) {
                    console.error("Error parsing supplier data:", error);
                    }
                };
                // Updated handler for exportation ID selection
 // Define your fixed categories
const categories = [
    'Admin Tasks',
    'Ground Crew Tasks',
    'Mineral labs tasks',
    'Operations supervisor tasks',
    'Comptoir Trade manager Tasks',
    'Comptoir Director Tasks',
    'Operations Manager Tasks',
    'Finance Tasks',
    'Mining Board Regulator Agent Tasks', 
    'Transporter tasks',
  ]; 
  
  // Function to get tasks for a specific category
  const getTasksForCategory = (category) => {
    if (!timeData || !timeData.tasks || timeData.tasks.length === 0) {
      return [];
    }
    
    return timeData.tasks
      .filter(task => task.task.startsWith(category))
      .map(task => {
        // Extract the subcategory part (removing the category prefix)
        const taskName = task.task.replace(`${category} `, '');
        return {
          ...task,
          taskName: taskName || task.task // If replacement didn't work, use original
        };
      });
  };
  
  // Function to handle exportation ID change
  const changeExportationId = (e) => {
    if (e.target.value === t("SelectExport")) {
      setTimeData(null);
      setSelectedCategory(null);
      return;
    }
    
    try {
      const selectedExportation = JSON.parse(e.target.value);
      
      // Set loading state
      setLoading(true);
      
      // Show toast notification
      toast.info('Generating Exportation report, please wait...', {
        delay: 100,
        autoClose: true
      });
      
      // Fetch timestamp data using the exportation ID
      axiosInstance.get('/report/timestamp', {
        params: {
          Exportid: selectedExportation.exportationid
        }
      }).then(response => {
        // Process the timestamp data
        console.log("Result after selecting", response.data.timestamp);
        
        if (response.data.success && response.data.timestamp) {
          // Set the time data in state
          setTimeData(response.data.timestamp);
          
          // Find the first category that has tasks
          for (const category of categories) {
            const categoryTasks = response.data.timestamp.tasks
              ? response.data.timestamp.tasks.filter(task => task.task.startsWith(category))
              : [];
              
            if (categoryTasks.length > 0) {
              setSelectedCategory(category);
              break;
            }
          }
          
          // If no tasks were found in any category, just select the first category
          if (!selectedCategory && categories.length > 0) {
            setSelectedCategory(categories[0]);
          }
        } else {
          toast.warning('No timestamp data available for this exportation ID', {
            autoClose: 3000
          });
        }
        
        // Clear loading state
        setLoading(false);
        
        // Show success notification
        toast.success('Exportation report generated successfully!', {
          autoClose: 3000
        });
        
      }).catch(error => {
        console.error("Error fetching timestamp data:", error);
        setLoading(false);
        toast.error('Failed to generate report. Please try again.', {
          autoClose: 3000
        });
      });
      
    } catch (error) {
      console.error("Error parsing exportation data:", error);
      setLoading(false);
    }
  };
  
//   const categories = getCategories();
// if (categories.length > 0) {
//   setSelectedCategory(categories[0]);
// }

//   // Function to paginate tasks
//   const paginate = (items, page, perPage) => {
//     const offset = perPage * (page - 1);
//     return items.slice(offset, offset + perPage);
//   };               // Fetch default trend data
    const fetchDefaultTrendData = async (supplierId) => {
        try {
            const response = await axiosInstance.get(`/report/trendgraph/${supplierId}`, {
                params: { country: normalizedCountry(country) }
            });

            if (response.data.success) {
                setDefaultTrendData({
                    Cassiterite: response.data.trendgraph.Cassiterite || [],
                    Coltan: response.data.trendgraph.Coltan || [],
                    Wolframite: response.data.trendgraph.Wolframite || [],
                    totalVolume: response.data.trendgraph.totalVolume
                });
                console.log("Total Volume By default",response.data.trendgraph.totalVolume)
            }
        } catch (error) {
            console.error('Error fetching default trend data:', error);
        }
    };

    
    const loadCompanies =  ()=>{
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/companies`,
            {
                params: {
                    country: normalizedCountry,
                }
            }).then(response=>{
            setcompanies(response.data.companies)
        })
    }
    //load suppliers companies trends
    const loadSuppliers = ()=>
        {
            let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/report/salestrend`,
            {
                params: {
                    country: normalizedCountry,
                }
            }).then(response=>{
            const totalVolume = response.data.salestrend.reduce((sum, item) => {
                    // Convert string to number and add to sum
                    return sum + parseFloat(item.volume || 0);
                }, 0);
            setsuppliers({
                suppliers_data:response.data.salestrend,
                // volume:response.data.salestrend.volume,
                totalVolume:totalVolume.toFixed(3)});
            
            //console.log("Suppliers",response.data.salestrend);
        })

        }
        const loadExoprtationID=()=>
            {
                let normalizedCountry = country.trim();
            
                // Special handling for Rwanda
                if (normalizedCountry.toLowerCase() === 'rwanda') {
                    // Randomly choose one of the three formats
                     normalizedCountry ='.Rwanda';
                    // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
                } else {
                    // For other countries, remove leading/trailing dots and spaces
                    normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
                }

                axiosInstance.get(`/report/exportation`,
                    {
                        params: {
                            country:normalizedCountry,
                        }
                    }).then(response=>{
                        setExportationid(response.data.exportation)
                    console.log("Exportation ID",response.data.exportation);
                    })
            }
    //Form apply filter
    // Add this function to load KYC summary data

    const loadReport = ()=>{
        if(type === `trace`){
            settrace({
                production: [],
                bags: [],
                blending: {
                    header: [],
                    rows: []
                },
                purchases: {
                    header: [],
                    rows: []
                },
                drums: [],
                bags_proc: [],
                processing: [],
                exports: []
            })
           
        }
        if(type === `trace` && !company){
            return
        }
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/report/${type !== 'trace' ? type : type+'/'+company?.id}`,
            {
                params: {
                    country: normalizedCountry,
                }
            }).then(response=>{
            if(type === `daily`){
                setdaily(prevDaily => ({
                    cassiterite: {
                        ...prevDaily.cassiterite,
                        ...response.data.cassiterite?.company?.[normalizedCountry]
                    },
                    coltan: {
                        ...prevDaily.coltan,
                        ...response.data.coltan?.company?.[normalizedCountry]
                    },
                    wolframite: {
                        ...prevDaily.wolframite,
                        ...response.data.wolframite?.company?.[normalizedCountry]
                    }
                }));
            }
            if (type === 'mtd') {
                setbalance(prevBalance => ({
                  cassiterite: {
                    ...prevBalance.cassiterite,
                    ...response.data.cassiterite.company[normalizedCountry]
                  },
                  coltan: {
                    ...prevBalance.coltan,
                    ...response.data.coltan.company[normalizedCountry]
                  },
                  wolframite: {
                    ...prevBalance.wolframite,
                    ...response.data.wolframite.company[normalizedCountry]
                  }
                }));
              }
            if(type === `deliveries`){

                setdeliveries(prevDeliveries=>
                ({
                    cassiterite: {
                        ...prevDeliveries.cassiterite,
                        ...response.data.cassiterite.company[normalizedCountry]
                      },
                      coltan: {
                        ...prevDeliveries.coltan,
                        ...response.data.coltan.company[normalizedCountry]
                      },
                      wolframite: {
                        ...prevDeliveries.wolframite,
                        ...response.data.wolframite.company[normalizedCountry]
                      }

                })

                )
            }
            if(type === `trace`){
                if(company){
                    toast.success("Trace report generated successfully!")
                }
                settrace(response.data.trace)
            }
        }).catch(err=>{
            try{
				if(err.response.code === 403){
					dispatch(Logout(navigate))
				}else{
					toast.warn(err.response.message)
				}
			}catch(e){
				toast.error(err.message)
			}
        })                
    }
    const loadMinerals = () => {
        if (type === 'sale' && mineral) {
            let normalizedCountry = country.trim();
    
            // Special handling for Rwanda
            if (normalizedCountry.toLowerCase() === 'rwanda') {
                normalizedCountry = '.Rwanda';
            } else {
                // For other countries, remove leading/trailing dots and spaces
                normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
            }
    
            axiosInstance.get(`/report/sales/${mineral}`, {
                params: {
                    country: normalizedCountry,
                }
            })
            .then(response => {
                // Ensure the response structure matches what you expect
                if (response.data && response.data.salereport) {
                    const totalValue = response.data.salereport.reduce((sum, item) => {
                        // Convert string to number and add to sum
                        return sum + parseFloat(item.value || 0);
                    }, 0);
                    const totalVolume = response.data.salereport.reduce((sum, item) => {
                        // Convert string to number and add to sum
                        return sum + parseFloat(item.volume || 0);
                    }, 0);

                    setSale({
                        sale_Report: response.data.salereport,
                        totalValue: totalValue.toFixed(3), 
                        totalVolume:totalVolume.toFixed(3)
                        // Round to 3 decimal places
                    });
                    //toast.success(`${mineral} sales report generated successfully!`);
                    //console.log("Sale Report", response.data.salereport);
                    //console.log("Total Value:", totalValue.toFixed(3));
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.status === 403) {
                        dispatch(Logout(navigate));
                    } else {
                        toast.warn(err.response.data.message || "An error occurred");
                    }
                } else {
                    toast.error(err.message || "An error occurred");
                }
            });
        }
    };
    const loadKycSummary = () => {
        if (type !== 'kycsummary') return;
        
        setKycLoading(true);
        
        // Format country parameter properly
        let normalizedCountry = country.trim();
        
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
          normalizedCountry = '.Rwanda';
        } else {
          // For other countries, remove leading/trailing dots and spaces
          normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        
        axiosInstance.get(`/Kycsummary`, {
          params: {
            country: normalizedCountry,
            platform: access
          }
        })
        .then(response => {
          // Important: Access the nested 'data' property 
          // Check if response has the expected structure
          if (response.data && response.data.data) {
            // Set state to the inner data object that contains the companies
            setKycSummary(response.data.data);
          } else {
            setKycSummary({});
            toast.warn("No KYC data available or invalid response format");
          }
          setKycLoading(false);
        })
        .catch(err => {
          setKycLoading(false);
          try {
            if (err.response?.code === 403) {
              dispatch(Logout(navigate));
            } else {
              toast.warn(err.response?.message || "Failed to load KYC summary");
            }
          } catch (e) {
            toast.error(err.message || "An error occurred");
          }
        });
      };
      
        
    
    //apply filter 
    const applyFilter = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRangeApplied(true);
        const formData = new FormData(e.target);
        const startDate = formData.get('start');
        const endDate = formData.get('end');
        
        // Format dates from YYYY-MM-DD to M/D/YYYY
        const formatDateForAPI = (dateStr) => {
          const [year, month, day] = dateStr.split('-');
          return `${parseInt(month)}/${parseInt(day)}/${year}`;
        };
    
        let normalizedCountry = country.trim();
    
            // Special handling for Rwanda
            if (normalizedCountry.toLowerCase() === 'rwanda') {
                normalizedCountry = '.Rwanda';
            } else {
                // For other countries, remove leading/trailing dots and spaces
                normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
            }
    
        try {
          const response = await axiosInstance.get(
            `/report/salesrange/${mineral}`,
            {
              params: {
                country: normalizedCountry,
                start_date: formatDateForAPI(startDate),
                end_date: formatDateForAPI(endDate)
              }
            }
          );
    
          if (response.data.success) {
            const totalValue = response.data.salereport.reduce((sum, item) => 
              sum + parseFloat(item.value || 0), 0
            );
    
            setAppliedSale({
              sale_Report: response.data.salereport,
              totalValue: totalValue.toFixed(3)
            });
            //console.log("Sales Report After Apply:", response.data.salereport);
           // toast.success(`${mineral} sales report generated successfully!`);
          } else {
            toast.warn(response.data.message || "Failed to fetch sales data");
          }
        } catch (error) {
          console.error('Error fetching sales report:', error);
          toast.error(error?.response?.data?.message || "An error occurred while fetching sales data");
        } finally {
            setLoading(false);
          }
      };
      // Apply year filter
    const applyYearFilter = async (e) => {
        e.preventDefault();
        setLoading(true);
        setYearFilterApplied(true); // Indicate that the year filter is applied

        const formData = new FormData(e.target);
        const year = formData.get('year');

        try {
            const response = await axiosInstance.get(
                `/report/trendgraphbyyear/${suppliertrend.id}`,
                {
                    params: {
                        country: normalizedCountry(country),
                        year: year
                    }
                }
            );

            if (response.data.success) {
                setFilteredTrendData({
                    Cassiterite: response.data.trendgraphbyyear.Cassiterite || [],
                    Coltan: response.data.trendgraphbyyear.Coltan || [],
                    Wolframite: response.data.trendgraphbyyear.Wolframite || [],
                    totalVolume: response.data.trendgraphbyyear.totalVolume
                });
                toast.success(`Data for ${year} loaded successfully!`);
            }
        } catch (error) {
            console.error('Error fetching trend data:', error);
            toast.error(error?.response?.data?.message || "An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };
    const normalizedCountry = (country) => {
        let normalized = country.trim();
        if (normalized.toLowerCase() === 'rwanda') {
            normalized = '.Rwanda';
        } else {
            normalized = normalized.replace(/^\.+|\.+$/g, '');
        }
        return normalized;
    };
    function paginate(array, page_number, page_size) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array ? array.slice((page_number - 1) * page_size, page_number * page_size) : []
    }

    useEffect(() => {
        setData(document.querySelectorAll("#report_wrapper tbody tr"));
        changeTitle(`${t('Report')} | Minexx`)
        loadReport()
        loadMinerals()
        loadSuppliers()
        loadExoprtationID();
        // if (timeData) {
        //     const categories = getCategories();
        //     if (categories.length > 0 && !selectedCategory) {
        //       setSelectedCategory(categories[0]);
        //     }
        //   }
        
        loadMonthlyData();
        loadMonthlyPurchase();
        if(type === 'trace'){
            loadCompanies()
        }
        if (type === 'kycsummary') {
            loadKycSummary();
          }
        if (suppliertrend && !yearFilterApplied) {
            fetchDefaultTrendData(suppliertrend.id);
        }
    }, [type, company,language,country, mineral,suppliertrend]);
    
    const loadMonthlyData = () => {
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            normalizedCountry = '.Rwanda';
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
    
        axiosInstance.get(`/report/Monthly`, {
            params: {
                country: normalizedCountry,
            }
        })
        .then(response => {
            // Add null checks and provide default values
            setMonthly({
                cassiterite: response.data.cassiterite.company[normalizedCountry]?.monthly || {},
                coltan: response.data.coltan.company[normalizedCountry]?.monthly || {},
                wolframite: response.data.wolframite.company[normalizedCountry]?.monthly || {} // This will default to empty object if path doesn't exist
            });
    
            //console.log('Monthly data:', {  
             //   cassiterite: response.data.cassiterite.company[normalizedCountry]?.monthly || {}
           // });
        })
        .catch(err => {
            try {
                if (err.response?.code === 403) {
                    dispatch(Logout(navigate));
                } else {
                    //console.log(err.response?.message);
                    //toast.warn(err.response.message);
                }
            } catch (e) {
                //console.log(err.message);
                //toast.error(err.message);
            }
        });
    };
    // Filter companies based on search term
// Add these pagination helper functions
const paginateKycData = (data, page) => {
    const startIndex = (page - 1) * kycItemsPerPage;
    const endIndex = startIndex + kycItemsPerPage;
    return data.slice(startIndex, endIndex);
  };
  
  // Updated filteredCompanies function
  const filteredCompanies = () => {
    if (!kycSummary) return [];
    
    // Filter companies based on search term
    return Object.entries(kycSummary).filter(([companyName]) => 
      companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Get paginated companies
  const getPaginatedCompanies = () => {
    const filtered = filteredCompanies();
    return paginateKycData(filtered, currentKycPage);
  };
  
  // Calculate total pages
  const totalKycPages = () => {
    return Math.ceil(filteredCompanies().length / kycItemsPerPage);
  };
  
  // Handle page changes
  const handleKycPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalKycPages()) {
      setCurrentKycPage(newPage);
    }
  };
    const loadMonthlyPurchase = () => {
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            normalizedCountry = '.Rwanda';
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
    
        axiosInstance.get(`/report/purchaseMonthly`, {
            params: {
                country: normalizedCountry,
            }
        })
        .then(response => {
            setMonthlyPurchase({
                cassiterite: response.data.purchases?.cassiterite?.company?.[normalizedCountry]?.monthly || {},
                coltan: response.data.purchases?.coltan?.company?.[normalizedCountry]?.monthly || {},
                wolframite: response.data.purchases?.wolframite?.company?.[normalizedCountry]?.monthly || {}
            });
    
            //console.log('MonthlyPurchase data:', {  
            //     cassiterite: response.data.purchases?.cassiterite?.company?.[normalizedCountry]?.monthly || {},
            //     coltan: response.data.purchases?.coltan?.company?.[normalizedCountry]?.monthly || {},
            //     wolframite: response.data.purchases?.wolframite?.company?.[normalizedCountry]?.monthly || {}
            // });
        })
        .catch(err => {
            try {
                if (err.response?.code === 403) {
                    dispatch(Logout(navigate));
                } else {
                    //toast.warn(err.response?.message);
                }
            } catch (e) {
                //toast.error(err.message);
            }
        });
    };
  
   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = (arr)=>Array(Math.ceil(arr.length / sort))
      .fill()
      .map((_, i) => i + 1);

   // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		//settest(i);
	};
   //Chart For the Daily 
   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

   const chartSeries = [
     {
       name: 'Cassiterite',
       data: months.map(month => (monthly.cassiterite[month] || 0) / 1000),
     },
     {
       name: 'Coltan',
       data: months.map(month => (monthly.coltan[month] || 0) / 1000),
     },
     {
       name: 'Wolframite',
       data: months.map(month => (monthly.wolframite[month] || 0) / 1000),
     },
   ];

const chartOptions = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            t('January'), 
            t('February'), 
            t('March'), 
            t('April'), 
            t('May'), 
            t('June'),
            t('July'), 
            t('August'), 
            t('September'), 
            t('October'), 
            t('November'), 
            t('December')
        ],
    },
    yaxis: {
        title: {
            text: t('MTDActuals'),
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' TONS';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
 //end the Daily Graph

    //chart For Balance in Country
    const chartSeries_Balance = [
        {
            name: t('WithRMR'),
            data: [
                ((balance.cassiterite.rmr || 0) / 1000).toFixed(2),
                ((balance.coltan.rmr || 0) / 1000).toFixed(2),
                ((balance.wolframite.rmr || 0)/ 1000).toFixed(2),
            ],
            
            
        },
        {
            name: t('WithMinexx'),
            data: [
                ((balance.cassiterite.minexx || 0)/ 1000).toFixed(2),
                ((balance.coltan.minexx || 0)/ 1000).toFixed(2),
                ((balance.wolframite.minexx || 0)/ 1000).toFixed(2),
            ],
        },
        {
            name: t('PendingShipment'),
            data: [
                ((balance.cassiterite.pending || 0) /  1000).toFixed(2),
                ((balance.coltan.pending || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.pending || 0)/ 1000).toFixed(2),
            ],
        },
        {
            name: t('Shipped'),
            data: [
                ((balance.cassiterite.shipped || 0) / 1000).toFixed(2),
                ((balance.coltan.shipped || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.shipped || 0 )/1000).toFixed(2),
            ],
        },
        {
            name: t('WithBuyer'),
            data: [
                ((balance.cassiterite.buyer || 0) / 1000).toFixed(2),
                ((balance.coltan.buyer || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.buyer || 0) / 1000).toFixed(2),
            ],
        },
        
    ];

    const chartOptions_Balance = {
        chart: {
            type: 'bar',
            height: 500,
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },
        xaxis: {
            categories: ['Cassiterite', 'Coltan', 'Wolframite'],
        },
        yaxis: {
            title: {
                text: t('Percentage'),
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2); // Adjust the number of decimal places as needed
                },
            },
        },
        tooltip: {
            y: {
                formatter: function (val, { series, seriesIndex }) {
                    const seriesName = series?.[seriesIndex]?.name;
                    if (seriesName && seriesName.includes('%')) {
                        return val + ' %';
                    }
                    return val + ' TONS';
                },
            },
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            labels: {
                colors: ['#ffff', '#ffff', '#ffff','#ffff', '#ffff'] // Change these colors as needed
            }
        },
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: '70%',
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                        offsetX: 0,
                    },
                },
            },
        ],
    };
//End for Balance in Country
//const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//Graph for Purchased
const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const chartSeries_Purchase = [
  {
    name: 'Cassiterite',
    data: monthss.map(month => monthlypurchase.cassiterite[month] || 0),
  },
  {
    name: 'Coltan',
    data: monthss.map(month => monthlypurchase.coltan[month] || 0),
  },
  {
    name: 'Wolframite',
    data: monthss.map(month => monthlypurchase.wolframite[month] || 0),
  },
];
const chartOptions_Purchase = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            t('January'), 
            t('February'), 
            t('March'), 
            t('April'), 
            t('May'), 
            t('June'),
            t('July'), 
            t('August'), 
            t('September'), 
            t('October'), 
            t('November'), 
            t('December')
        ],
    },
    yaxis: {
        title: {
            text: t('TotalAmountPaid'),
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' Money($)';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
//start graph for supplier trends
 // Process trend data for the chart
 const processTrendData = (data) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const cassiteriteData = months.map(month => {
        const monthData = data.Cassiterite.find(d => d.month === month);
        return monthData ? monthData.volume : 0;
    });

    const coltanData = months.map(month => {
        const monthData = data.Coltan.find(d => d.month === month);
        return monthData ? monthData.volume : 0;
    });

    const wolframiteData = months.map(month => {
        const monthData = data.Wolframite.find(d => d.month === month);
        return monthData ? monthData.volume : 0;
    });

    return {
        cassiterite: cassiteriteData,
        coltan: coltanData,
        wolframite: wolframiteData
    };
};

// Chart series for supplier trends
const chartSeries_Trend = [
    {
        name: 'Cassiterite',
        data: filteredTrendData.Cassiterite.length > 0 ? processTrendData(filteredTrendData).cassiterite : processTrendData(defaultTrendData).cassiterite
    },
    {
        name: 'Coltan',
        data: filteredTrendData.Coltan.length > 0 ? processTrendData(filteredTrendData).coltan : processTrendData(defaultTrendData).coltan
    },
    {
        name: 'Wolframite',
        data: filteredTrendData.Wolframite.length > 0 ? processTrendData(filteredTrendData).wolframite : processTrendData(defaultTrendData).wolframite
    }
];

// Chart options for supplier trends
const chartOptions_Trend = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            t('January'), t('February'), t('March'), t('April'), t('May'), t('June'),
            t('July'), t('August'), t('September'), t('October'), t('November'), t('December')
        ],
    },
    yaxis: {
        title: {
            text: t('Volume (Kg)'),
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2);
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' Kg';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff', '#fff', '#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
// Create helper components for the KYC summary UI
const YesNoButton = ({ value }) => (
    <div className={`d-flex justify-content-center`}>
      <span 
        className={`btn ${value === 'Yes' ? 'btn-info' : 'btn-danger'} btn-sm px-3`}
        style={{ 
          width: '60px',
          fontWeight: 'bold', 
          pointerEvents: 'none'
        }}
      >
        {value === 'Yes' ? 'YES' : 'NO'}
      </span>
    </div>
  );
  
  const ProgressBar = ({ percentage }) => {
    const numPercentage = parseInt(percentage, 10);
    return (
      <div className="d-flex align-items-center">
        <div 
          className="progress" 
          style={{ 
            height: '12px', 
            width: '100px',
            backgroundColor: '#333'
          }}
        >
          <div 
            className={`progress-bar ${numPercentage < 50 ? 'bg-danger' : 'bg-info'}`}
            role="progressbar" 
            style={{ width: `${numPercentage}%` }} 
            aria-valuenow={numPercentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          />
        </div>
        <span className="ms-2">{percentage}</span>
      </div>
    );
  };
  
//end Purchase 
    return (
        <>
            { attachment ? <Modal size='lg' show={attachment} onBackDropClick={()=>setattachment(null)}>
                <Modal.Header>
                    <h3 className='modal-title'>{attachment.field}</h3>
                    <Link className='modal-dismiss' data-toggle="data-dismiss" onClick={()=>setattachment(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <img alt='' className='rounded mt-4' width={'100%'} src={`https://lh3.googleusercontent.com/d/${attachment.image}=w2160?authuser=0`}/>
                </Modal.Body>
            </Modal> : null }
            <div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item active"><Link to={"#"}>{t("Dashboard")}</Link></li>
					<li className="breadcrumb-item"><Link to={"#"} >{t("Report")}</Link></li>
					<li className="breadcrumb-item">
                    <Link to={"#"}>
                        {type === 'today' 
                        ? "Today's Report" 
                        : type === 'trace' 
                            ? `${t('TraceReport')} ${company ? `[${company.name}]` : ''}`
                            : type ==='sale'
                            ? t('SaleReport')
                            : type === 'daily' 
                            ? t('TotalStockDelivery')
                            :type ==='kycsummary'
                            ? t('Kyc Summary')
                            : type === 'mtd' 
                                ? t('InStockCountryBalance')
                                : t('TotalPurchase')}
                    </Link>
                    </li>
				</ol>
			</div>
            {/**<div className="row mb-5 align-items-center">
				<div className="col-lg-3 mb-4 mb-lg-0">
					<Link to={"#"} className="btn btn-outline-primary light  btn-lg btn-block rounded" onClick={()=>{} }> + Generate Report</Link>
				</div>
            </div>**/}
            <div className="row">
                { type === `admin` ?
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Generated Reports</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive ticket-table">
                                <div id="report_wrapper" className="dataTables_wrapper no-footer">
                                    <div className='d-flex justify-content-between mb-3 custom-tab-list'>
                                        <div className='d-flex align-items-center'>
                                            <label className="me-2">Show</label>
                                            <Dropdown className="search-drop">
                                                <Dropdown.Toggle className="">10</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>25</Dropdown.Item>
                                                    <Dropdown.Item>50</Dropdown.Item>
                                                    <Dropdown.Item>75</Dropdown.Item>
                                                    <Dropdown.Item>100</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <label className="ms-2">entries</label>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <label className="me-2">Search:</label>
                                            <input type="search" placeholder="" className="form-control" />
                                        </div>
                                    </div>
                                    <table id="example" className="display dataTablesCard table-responsive-xl dataTable no-footer w-100">
                                        <thead>
                                            <tr>                                               	                                            
                                                <th>ID</th>
												<th>Name</th>
												<th>Requested</th>
												<th>Completed On</th>
												<th>Status</th>  
												<th>Action</th>                                           
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ticketData.slice(0, 1).map((item, index)=>(
                                                <tr key={index}>     
                                                    <td className="sorting_1">{item.number}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{user.type === `minexx` ? `Production Data Report` : `Minexx Trace Data Report`} (11/01/2023 - 12/31/2023)</Link>
                                                        </div>
                                                    </td>                                                    
                                                    <td>
                                                        Jan 10, 2024 02:23
                                                    </td>
                                                    <td>Jan 9, 2024 17:02</td>
                                                    <td>
                                                        <span className="badge light badge-success">Successful</span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm light btn-success">Download PDF</button>
                                                        &emsp;
                                                        <button className="btn btn-sm light btn-primary">Download XLSL</button>
                                                    </td>
                                                </tr>
                                            ))}                                           
                                        </tbody>                                        
                                    </table>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
                                        <div className="dataTables_info">
                                        {t("Showing")} {activePag.current * sort + 1} {t("To")}{" "}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{" "}
                                            {t("Of")} {data.length} {t("Entries")}
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers mb-0"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                style={{
                                                    minWidth: '120px',  // Adjust this value as needed
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    padding: '8px 12px',  // Adjust padding to your preference
                                                    display: 'inline-block',
                                                    textAlign: 'center'
                                                }}
                                                to="/reports"
                                                onClick={() =>
                                                    activePag.current > 0 &&
                                                    onClick(activePag.current - 1)
                                                }
                                            >
                                                {t("Previous")}
                                            </Link>
                                            <Link
                                                className="paginate_button next"
                                                to="/reports"
                                                onClick={() =>  {
                                                    //console.log("next")
                                                        bagsPage < paggination(trace?.bags || []).length &&
                                                        onClick(()=>setbagsPage(bagsPage+1))
                                                    }
                                                }
                                            >
                                                {t("Next")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                :
                type === `daily` ? 
                <div className='row'>
                  <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* Stock Delivery */}
                                <h4 className="card-title">Cassiterite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ct">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct4">     
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(4.76*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct5">
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.cassiterite.mtdActual/1000)/(4.76*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="col1">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col4">     
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.38*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col5">     
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.coltan.mtdActual/1000)/(0.38*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wt1">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt4">
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.19*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt5">     
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.wolframite.mtdActual/1000)/(0.19*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={500}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                
                :
                type === `mtd` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* In Stock Country */}
                                <h4 className="card-title">Cassiterites</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Balance}
                                    series={chartSeries_Balance}
                                    type="bar"
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                type === `deliveries` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* Total Purchase */}
                                <h4 className="card-title">Cassiterites</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteritePurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanPurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="example" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Purchase}
                                    series={chartSeries_Purchase}
                                    type="bar"
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                : type === 'trace' ?
                <div className='row'>
                    { company ? <div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <select onChange={changeCompany} className='form-control'>
                                <option>{t('SelectCompany')}</option>
                                { companies.map(company=><option key={company.id} value={JSON.stringify(company)}>{company.name}</option>) }
                            </select>
                        </div>
                    </div>
                    <Tab.Container defaultActiveKey="production">
                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link  px-2 px-lg-3"  to="#production" role="tab" eventKey="production">
                                    {t("Production")}
                                </Nav.Link>
                            </Nav.Item>
                            { access === `3ts` ?
                            <>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags" role="tab" eventKey="bags">
                                    {t("BagsProduced")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#processing" role="tab" eventKey="processing">
                                    {t("Processing")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags_proc" role="tab" eventKey="bags_proc">
                                    {t("BagsProcessed")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#blending" role="tab" eventKey="blending">
                                    {t("Blending")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#drums" role="tab" eventKey="drums">
                                    {t("Drums")}
                                </Nav.Link>
                            </Nav.Item>
                            </> :
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#purchase" role="tab" eventKey="purchase">
                                    {t("Purchase")}
                                </Nav.Link>
                            </Nav.Item> }
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#exports" role="tab" eventKey="exports">
                                    {t("Exports")}
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className='mt-10' style={{ marginTop: 25 }}>
                            <Tab.Pane eventKey="production" id='production'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Production")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            { access === `3ts` ? <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th className="text-center text-dark">
                                                            {t("ProductionWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BusinessLocation")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfRMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfOperatorRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Note")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        trace.production.map((prod, i)=><tr key={`prod${i}`}>
                                                            <td>{prod.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${prod.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{prod.weight}</td>
                                                            <td>{prod.location}</td>
                                                            <td>{prod.rmbRep}</td>
                                                            <td>{prod.traceAgent}</td>
                                                            <td>{prod.operator}</td>
                                                            <td>{prod.bags}</td>
                                                            <td>{prod.totalWeight}</td>
                                                            <td>{prod.note}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.production.length === 0 ? <tr>
                                                            <td colSpan={9}>{t('NoProduction')}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table> : <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                <tr>
                                                {trace.production?.header?.map(h => (
                                                    <th 
                                                        className="text-center text-dark"
                                                        key={h} // Added key for React list rendering
                                                    >
                                                        {t(h)}
                                                    </th>
                                                ))}
                                            </tr>
                                                </thead>
                                                <tbody>
    {trace.production?.production?.length > 0 ? (
        trace.production.production.map((prod, i) => {
            // Check if prod is an object or an array
            const rowData = Array.isArray(prod) ? prod : Object.values(prod);
            return (
                <tr key={`prod${i}`}>
                    {rowData.map((p, index) => (
                        <td key={index}>
                            {p.includes && p.includes('Images') ? (
                                <button 
                                    onClick={() => showAttachment(p, `Transaction: ${rowData[0]}`)} 
                                    className='btn btn-sm btn-primary'
                                >
                                    View
                                </button>
                            ) : (
                                p
                            )}
                        </td>
                    ))}
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan={9}>The selected company does not have any production to show.</td>
        </tr>
    )}
</tbody>
                                            </Table>}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            { access === `3ts` ?
                            <>
                            <Tab.Pane eventKey="bags" id='bags'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("BagsProduced")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("TagNumber")}</th>
                                                        <th className="text-center text-dark">
                                                        {t("Weight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TunnelPitNumberOrName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionMiningDate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MinerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransporterName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentativeAtMineSite")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("EstimatedConcentratePercentage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ColorOfTheBagDrumPackage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransportMode")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransportItinerary")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Time")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionID")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace?.bags || [], bagsPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.tunnel}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.miner}</td>
                                                            <td>{bag.transporter}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.concentrate}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.transport}</td>
                                                            <td>{bag.itinerary}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.production}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace?.bags.length === 0 ? <tr>
                                                            <td colSpan={14}>{t("NoSelected")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(bagsPage-1) * sort + 1} {t("To")}{" "}
                                                {trace?.bags.length > bagsPage * sort
                                                    ? bagsPage*sort
                                                    : trace?.bags.length}{" "}
                                                {t("Of")}{trace?.bags.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    // to="/reviews"
                                                    onClick={() =>
                                                    bagsPage > 1 && setbagsPage(bagsPage - 1)
                                                    }
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsPage < paggination(trace?.bags || []).length &&
                                                        setbagsPage(bagsPage + 1)
                                                    }
                                                >
                                                    {t("Next")}
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="processing" id='processing'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Processing")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BusinessLocation")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("OperatorRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfInputBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalInputWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfOutputBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalOutputWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TagNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TaggingDateTime")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProcessingWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Note")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfMineSupplier")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PresenceOfASI")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Laboratory")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Certificate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PricingUSD")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("LME")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TC")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PricePerTaPercentage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("UnitPrice")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalPrice")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PaymentMethod")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("LotNumber")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace.processing, procPage, sort).map(proc=><tr key={proc.id}>
                                                            <td>{proc.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${proc.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{proc.date}</td>
                                                            <td>{proc.location}</td>
                                                            <td>{proc.rmb}</td>
                                                            <td>{proc.trace}</td>
                                                            <td>{proc.operator}</td>
                                                            <td>{proc.mineral}</td>
                                                            <td>{proc.inputBags}</td>
                                                            <td>{proc.inputWeight}</td>
                                                            <td>{proc.outputBags}</td>
                                                            <td>{proc.outputWeight}</td>
                                                            <td>{proc.tags.split(',')[0]}</td>
                                                            <td>{proc.tagDate}</td>
                                                            <td>{proc.grade}</td>
                                                            <td>{proc.processingWeight}</td>
                                                            <td>{proc.note}</td>
                                                            <td>{proc.supplier}</td>
                                                            <td>{proc.asi}</td>
                                                            <td>{proc.lab}</td>
                                                            <td>{proc.certificate}</td>
                                                            <td>{proc.price}</td>
                                                            <td>{proc.lme}</td>
                                                            <td>{proc.tc}</td>
                                                            <td>{proc.ta}</td>
                                                            <td>{proc.unitPrice}</td>
                                                            <td>{proc.totalPrice}</td>
                                                            <td>{proc.paymentMethod}</td>
                                                            <td>{proc.security}</td>
                                                            <td>{proc.lot}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.processing.length === 0 ? <tr>
                                                            <td colSpan={29}>{t("NoProcessing")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(procPage-1) * sort + 1} {t("To")}{" "}
                                                {trace.processing.length > procPage * sort
                                                    ? procPage*sort
                                                    : trace.processing.length}{" "}
                                                {t("Of")} {trace.processing.length} {t("Entrier")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    onClick={() => drumsPage > 1 && setdrumsPage(drumsPage - 1)}
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            procPage < paggination(trace.processing).length &&
                                                            setprocPage(procPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bags_proc" id='bags_proc'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("BagsProcessed")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("TagNumber")}</th>
                                                        <th className="text-center text-dark">
                                                        {t("Weight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProcessingID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionMiningDate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentativeAtMineSite")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Time")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("StorageContainer")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ColorOfThePackageContainer")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace?.bags_proc, bagsProcPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.processing}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.storage}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.mineral}</td>
                                                            <td>{bag.grade}</td>
                                                        </tr>)
                                                    }{
                                                        trace?.bags_proc.length === 0 ? <tr>
                                                            <td colSpan={24}>{t("NoProcessedBags")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(bagsProcPage-1) * sort + 1} {t("To")}{" "}
                                                {trace?.bags_proc.length > bagsProcPage * sort
                                                    ? bagsProcPage*sort
                                                    : trace?.bags_proc.length}{" "}
                                                {t("Of")} {trace?.bags_proc.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    // to="/reviews"
                                                    onClick={() =>
                                                        bagsProcPage > 1 && setbagsProcPage(bagsProcPage - 1)
                                                    }
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsProcPage < paggination(trace?.bags_proc).length &&
                                                        setbagsProcPage(bagsProcPage + 1)
                                                    }
                                                >
                                                    {t("Next")}
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="blending" id='blending'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Blending")}</h4>
                                    </div>
                                    <div className='card-body'>
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <table
                                                    id="example5"
                                                    className="display dataTable w-100 no-footer"
                                                    role="grid"
                                                    aria-describedby="example5_info"
                                                >
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.blending['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            key={header} 
                                                            >
                                                           {t(header)}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {trace.blending['rows'].length === 0 ? (
                                                            <tr>
                                                                <td colSpan={trace.blending['header'].length}>{t("NoBlendingRecords")}</td> 
                                                            </tr>
                                                        ) : (
                                                            trace.blending['rows'].map((row, index) => (
                                                                <tr key={`blending-${row.ID || index}`}>
                                                                    {trace.blending['header'].map((headerKey) => (
                                                                        <td key={headerKey}>
                                                                            {headerKey.includes('Miners_Images') ? 
                                                                                <button 
                                                                                    className="btn btn-sm btn-primary" 
                                                                                    onClick={() => showAttachment(row[headerKey], headerKey)}
                                                                                >
                                                                                    View
                                                                                </button> 
                                                                            : 
                                                                                row[headerKey]
                                                                            }
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="drums" id='drums'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Drums")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("DrumNumber")}</th>
                                                        <th className="text-center text-dark">
                                                            {t("GrossWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NetWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ITSCITagNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("DrumBagColor")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BlendingID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ASITagNumber")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.drums, drumsPage, sort).map(drum=><tr key={`drum${drum.drum}`}>
                                                                <td>{drum.drum}</td>
                                                                <td>{drum.grossWeight}</td>
                                                                <td>{drum.netWeight}</td>
                                                                <td>{drum.itsci}</td>
                                                                <td>{drum.color}</td>
                                                                <td>{drum.grade}</td>
                                                                <td>{drum.blending}</td>
                                                                <td>{drum.asi}</td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.drums.length === 0 ? <tr>
                                                                <td colSpan={24}>{t("NoDrums")}</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(drumsPage-1) * sort + 1} {t("To")}{" "}
                                                {trace.drums.length > drumsPage * sort
                                                    ? drumsPage*sort
                                                    : trace.drums.length}{" "}
                                               {t("Of")} {trace.drums.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        style={{
                                                            minWidth: '120px',  // Adjust this value as needed
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            padding: '8px 12px',  // Adjust padding to your preference
                                                            display: 'inline-block',
                                                            textAlign: 'center'
                                                        }}
                                                        
                                                        onClick={() =>
                                                            drumsPage > 1 && setdrumsPage(drumsPage - 1)
                                                        }
                                                    >
                                                        {t("Previous")}
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            drumsPage < paggination(trace.drums).length &&
                                                            setdrumsPage(drumsPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            </> : 
                            <Tab.Pane eventKey="purchase" id='purchase'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Purchase")}</h4>
                                    </div>
                                    <div className='card-body'>
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <Table bordered striped hover responsive size='sm'>
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.purchases['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            key={header}
                                                            >
                                                            {t(header)}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                                                                    <tbody>
                                                    {trace.purchases['rows'].length === 0 ? (
                                                        <tr>
                                                            <td colSpan={trace.purchases['header'].length}>
                                                                {t("NoPurchaseRecords")}
                                                            </td> 
                                                        </tr>
                                                    ) : (
                                                        trace.purchases['rows'].map((row, rowIndex) => (
                                                            <tr key={`purchase-${rowIndex}`}>
                                                                {trace.purchases['header'].map((headerField, colIndex) => (
                                                                    <td key={`${rowIndex}-${colIndex}`}>
                                                                        {(() => {
                                                                            const fieldValue = row[headerField];
                                                                            return fieldValue && fieldValue.includes(`Sell_Images`) ? (
                                                                                <button 
                                                                                    className="btn btn-sm btn-primary" 
                                                                                    onClick={() => showAttachment(fieldValue, headerField)}
                                                                                >
                                                                                    View
                                                                                </button>
                                                                            ) : (
                                                                                fieldValue || ''
                                                                            );
                                                                        })()}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Tab.Pane> }
                            <Tab.Pane eventKey="exports" id='exports'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Exports")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center text-dark">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NetWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("GrossWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportationID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExporterRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Destination")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Itinerary")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ShipmentNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportCertificateNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RRACertificateNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportValueUSD")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Transporter")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("IDNumberOfDriver")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TruckPlateNumberFront")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TruckPlateNumberBack")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfTags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalGrossWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalNetWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Attachments")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.exports, exportsPage, sort).map(exp=><tr key={exp.exportationID}>
                                                                <td>{exp.date}</td>
                                                                <td>{exp.mineral}</td>
                                                                <td>{exp.grade}</td>
                                                                <td>{access === '3ts' ? exp.netWeight : (exp.netWeight/1000).toFixed(2)}</td>
                                                                <td>{access === '3ts' ? exp.grossWeight : (exp.grossWeight/1000).toFixed(2)}</td>
                                                                <td>{exp.exportationID}</td>
                                                                <td>{exp.rmbRep}</td>
                                                                <td>{exp.exportRep}</td>
                                                                <td>{exp.traceabilityAgent}</td>
                                                                <td>{exp.destination}</td>
                                                                <td>{exp.itinerary}</td>
                                                                <td>{exp.shipmentNumber}</td>
                                                                <td>{exp.exportCert}</td>
                                                                <td>{exp.rraCert}</td>
                                                                <td>{exp.value}</td>
                                                                <td>{exp.transporter}</td>
                                                                <td>{exp.driverID}</td>
                                                                <td>{exp.truckFrontPlate}</td>
                                                                <td>{exp.truckBackPlate}</td>
                                                                <td>{exp.tags}</td>
                                                                <td>{exp.totalGrossWeight}</td>
                                                                <td>{exp.totalNetWeight}</td>
                                                                <td><Link to={`/exports/${exp.id}`}>View Attachments</Link></td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.exports.length === 0 ? <tr>
                                                                <td colSpan={24}>{t("NoExports")}</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(exportsPage-1) * sort + 1} {t("To")}{" "}
                                                {(trace.exports.length > exportsPage * sort
                                                    ? exportsPage*sort
                                                    : trace.exports.length)}{" "}
                                                {t("Of")} {trace.exports.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        style={{
                                                            minWidth: '120px',  // Adjust this value as needed
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            padding: '8px 12px',  // Adjust padding to your preference
                                                            display: 'inline-block',
                                                            textAlign: 'center'
                                                        }}
                                                        onClick={() =>
                                                            exportsPage > 1 && setexportsPage(exportsPage - 1)
                                                        }
                                                    >
                                                        {t("Previous")}
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            exportsPage < paggination(trace.exports).length &&
                                                            setexportsPage(exportsPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    </div> : <div className='row'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                            <h5 className='card-title'>{t("SelectCompany")}</h5>
                            </div>
                            <div className='card-body'>
                                    <select onChange={changeCompany} className='form-control'>
                                        <option>{t("SelectCompanyShort")}</option>
                                        { companies.map(company=><option value={JSON.stringify(company)}>{company.name}</option>) }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                :
                type === 'sale' ? (
                   
                    <div className='row'>
                        <div className='col-md-5'>
                        {access === "3ts"? (  
                            // for prevent access of sale report to the gold 
                            <div className='card'>
                                <div className='card-header'>
                                    <h5 className='card-title'>{t("SelectMinerals")}</h5> 
                                </div>
                                <div className='card-body'>
                                    <select onChange={changeMineral} className='form-control'>
                                        <option>{t("SelectMineralShort")}</option>
                                        {access === '3ts' ? (
                                            <>
                                                <option value="Cassiterite">Cassiterite/Tin</option>
                                                <option value="Coltan">Coltan/Tantalum</option>
                                                <option value="Wolframite">Wolframite</option>
                                            </>
                                        ) : (
                                            <option value="Gold">Gold</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            ):
                            (<div></div>
                            //nothing show when it is gold 
                                
                            )} 
                        </div>
                                    
                        {mineral && (
                            <>
                                <div className='col-md-4'>
                                    <div className='card'>
                                        <div className='card-header'>
                                            <h5 className='card-title text-center'>{t("Sales")}</h5>
                                        </div>
                                        <div className='card-body'>
                                        <h3 className='text-center text-primary fs-40'>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(
                                            rangeapplied 
                                                ? (!isNaN(appliedsale.totalValue) ? parseFloat(appliedsale.totalValue) : 0)
                                                : (!isNaN(sale.totalValue) ? parseFloat(sale.totalValue) : 0)
                                        )}
                                    </h3>
                                </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title text-center mb-0">{t('Viewby')}</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={applyFilter}> 
                                                <div className="row mb-3">
                                                    <div className="col-6 ps-2 pe-1">
                                                        <input type="date" name="start" className="form-control form-control-sm" defaultValue="2023-01-01" />
                                                    </div>
                                                    <div className="col-6 ps-1 pe-2">
                                                        <input type="date" name="end" className="form-control form-control-sm"   defaultValue={new Date().toISOString().split('T')[0]} />
                                                    </div>
                                                </div>
                                                <input type="hidden" name="mineral" value={mineral} />
                                                <div className="d-grid">
                                                    <button className="btn btn-primary btn-sm" disabled={loading}>
                                                    {loading ? 'Loading...' : 'Apply'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {mineral && (
                            <div className='card'>
                                <div className='card-header'>
                                    <h4 className='card-title'>{mineral} {t("CassiteriteSaleReport")}</h4>
                                </div>
                                <div className='card-body'>
                                    <div id="soldre-view" className="dataTables_wrapper no-footer">
                                    <Table bordered striped hover responsive size='sm'>
                                        <thead>
                                            <tr>
                                                <th>{t("Supplier")}</th>
                                                <th className="text-center text-dark">{t("Volume")}</th>
                                                <th className="text-center text-dark">{t("Values")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginate(
                                                rangeapplied ? appliedsale.sale_Report : sale.sale_Report, 
                                                salesPage, 
                                                20
                                            ).map((sale, i) => (
                                                <tr key={`sale${i}`}>
                                                    <td>{sale.supplier}</td>
                                                    <td>{sale.volume} Kg</td>
                                                    <td>
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD'
                                                        }).format(!sale.value || isNaN(sale.value) ? 0 : sale.value)}
                                                    </td>
                                                </tr>
                                            ))}
                                            {(rangeapplied ? appliedsale.sale_Report : sale.sale_Report).length === 0 ? (
                                                <tr>
                                                    <td colSpan={14}>{t("NoSelectedMineral")}</td>
                                                </tr>
                                            ) : (
                                                <tr></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                            <div className="dataTables_info">
                                                {t("Showing")} {(salesPage-1) * sort + 1} {t("To")}{" "}
                                                {sale?.sale_Report.length > salesPage * sort ? salesPage*sort : sale?.sale_Report.length}{" "}
                                                {t("Of")} {sale?.sale_Report.length} {t("Entries")}
                                            </div>
                                            <div className="dataTables_paginate paging_simple_numbers" id="example2_paginate">
                                                <Link
                                                    className="paginate_button previous disabled"
        
                                                    onClick={() => salesPage > 1 && setsalesPage(salesPage - 1)}
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() => salesPage < paggination(sale?.sale_Report || []).length && setsalesPage(salesPage + 1)}
                                                >
                                                    {t("Next")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                :
                type === 'suppliertrends' ? (
                   
                    <div className='row'>
                        <div className='col-md-5'>
                        {access === "3ts"? (  
                            // for prevent access of sale report to the gold 
                            <div className='card'>
                                <div className='card-header'>
                                    <h5 className='card-title'>{t("SelectMineralstrends")}</h5>
                                </div>
                                <div className='card-body'>
                                <select onChange={changesuppliertrends} className='form-control'>
                <option>{t("SelectCompanyShort")}</option>
                {access === '3ts' && suppliers && suppliers.suppliers_data && suppliers.suppliers_data.length > 0 ? (
                    suppliers.suppliers_data.map(supplier => (
                        <option 
                            key={supplier.id} 
                            value={JSON.stringify(supplier)}
                        >
                            {supplier.supplier}
                        </option>
                    ))
                ) : (
                    <option value=""></option>
                )}
            </select>
                                </div>
                            </div>
                            ):
                            (<div></div>
                            //nothing show when it is gold 
                                
                            )}
                        </div>
                                    
                        {suppliertrend && (
                            <>
                                <div className='col-md-4'>
                                    <div className='card'>
                                        <div className='card-header'>
                                            <h5 className='card-title text-center'>{t("Volume")}</h5>
                                        </div>
                                        <div className='card-body'>
                                        <h3 className="text-center text-primary fs-40">
                                            {yearFilterApplied
                                                ? (filteredTrendData.totalVolume > 0 
                                                    ? filteredTrendData.totalVolume.toFixed(2) + " Kg" 
                                                    : <>
                                                        0.00 Kg <br /> No data found
                                                    </>)
                                                : (defaultTrendData.totalVolume > 0 
                                                    ? defaultTrendData.totalVolume.toFixed(2) + " Kg" 
                                                    : <>
                                                        0.00 Kg <br /> No data found
                                                    </>)
                                            }
                                        </h3>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title text-center mb-0">{t('Sort By')}</h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={applyYearFilter}> 
                                                <div className="row mb-3">
                                                    
                                                    <div className="col-6 ">
                                                        <select className='form-control' name='year' >
                                                            <option value="2025">2025</option>
                                                            <option value='2024'>2024</option> 
                                                            <option value='2023'>2023</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <input type="hidden" name="mineral" value={mineral} />
                                                <div className="d-grid">
                                                    <button className="btn btn-primary btn-sm" disabled={loading}>
                                                    {loading ? 'Loading...' : 'Apply'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                             
                            </>
                        )}
                         {suppliertrend && (
                <div className='col-12 mt-4'>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">{t("SalesTrendOverview")}</h4>
                        </div>
                        <div className="card-body">
                        {yearFilterApplied
                        ? (filteredTrendData.totalVolume > 0 ? (
                            <ReactApexChart
                                options={chartOptions_Trend}
                                series={chartSeries_Trend}
                                type="bar"
                                height={500}
                            />
                        ) : (
                            <p className="text-center">No data found</p>
                        ))
                        : (defaultTrendData.totalVolume > 0 ? (
                            <ReactApexChart
                                options={chartOptions_Trend}
                                series={chartSeries_Trend}
                                type="bar"
                                height={500}
                            />
                        ) : (
                            <p className="text-center">No data found</p>
                        ))
                    }
                        </div>
                    </div>
                </div>
            )}
                    </div>
                )
                :
                type === 'timetracking' ? (
                   
                    <div className='row'>
                        <div className='col-md-5'>
                        {access === "3ts"? (  
                            // for prevent access of sale report to the gold 
                            <div className='card'>
                                <div className='card-header'>
                                    <h5 className='card-title'>{t("SelectExportID")}</h5>
                                </div>
                                <div className='card-body'>
                                <select onChange={changeExportationId} className='form-control'>
                                    <option>{t("SelectExport")}</option>
                                    {access === '3ts' && exportationid && exportationid.length > 0 ? (
                                        exportationid.map(export_item => (
                                            <option 
                                                key={export_item.exportationid} 
                                                value={JSON.stringify(export_item)}
                                            >
                                                {export_item.exportationid}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">{t("NoExportationData")}</option>
                                    )}
                                </select>
                                </div>
                            </div>
                            ):
                            ( <div className='card'>
                                <div className='card-header'>
                                    <h5 className='card-title'>{t("SelectExportID")}</h5>
                                </div>
                                <div className='card-body'>
                                <select onChange={changeExportationId} className='form-control'>
                                    <option>{t("SelectExport")}</option>
                                    {access === 'gold' && exportationid && exportationid.length > 0 ? (
                                        exportationid.map(export_item => (
                                            <option 
                                                key={export_item.exportationid} 
                                                value={JSON.stringify(export_item)}
                                            >
                                                {export_item.exportationid}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">{t("NoExportationData")}</option>
                                    )}
                                </select>
                                </div>
                            </div>
                                
                            )}
                        </div>
                                    
                        {timeData && (
            <>
                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title text-center'>{t("Duration")}</h5>
                        </div>
                        <div className='card-body'>
                        <h3 className="text-center text-primary fs-40">
                            {loading ? (
                                <span>Loading...</span>
                            ) : (
                                timeData.duration ? (
                                    timeData.duration + " Days"
                                ) : (
                                    <>
                                        <h4 className='text text-danger'>Not Completed</h4>
                                    </>
                                )
                            )}
                        </h3>
                        </div>
                    </div>
                </div>
            </>
        )}
       {timeData && (
  <div className="row">
    <div className="col-xl-3">
      <ListGroup className="mb-4">
        {categories.map((category, i) => {
          // Only show categories that have tasks
          const hasTasks = timeData.tasks 
            ? timeData.tasks.some(task => task.task.startsWith(category))
            : false;
            
          // Optionally, you can hide empty categories
          if (!hasTasks) return null;
          
          return (
            <ListGroup.Item 
              key={i} 
              onClick={() => setSelectedCategory(category)} 
              action 
              active={selectedCategory === category}
              className="d-flex align-items-center"
            >
              {t(category)}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>

    <div className="col-xl-9">
      {/* Rest of the component remains the same */}
      <div className="card">
        <div className="card-header">
            <h4 className="card-title">{timeData.exportationId} {t("Tradetimelinereport")}</h4>
            {selectedCategory && <h5>{t(selectedCategory)}</h5>}
        </div>
        <div className="card-header border-top">
            <h5 className="card-title">{t("Blending ID ")}{timeData.exportationId} </h5>
            <h5>{timeData.blendingid}</h5>
        </div>
        <div className="card-body">
          <div id="soldre-view" className="dataTables_wrapper no-footer">
            {selectedCategory && (
              <div className="row">
                {paginate(
                  getTasksForCategory(selectedCategory),
                  timePage,
                  sort
                ).map((task, i) => (
                  <div key={i} className="col-12 mb-3">
                    <div className="p-3 border rounded d-flex justify-content-between align-items-center">
                      <span>{task.taskName}</span>
                      {task.timestamp 
                            ? <span className="badge bg-primary">
                                {new Date(task.timestamp).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                </span>
                            : <span className="badge bg-danger">
                                No Date
                                </span>
                            }
                    </div>
                  </div>
                ))}
                
                {getTasksForCategory(selectedCategory).length === 0 && (
                  <div className="col-12 text-center">
                    <p>{t("No tasks available for this category")}</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination section remains the same */}
          </div>
        </div>
      </div>
    </div>
  </div>
)}      </div>
                ):
                type === 'kycsummary' ? (
                    <div className="row">
                      <div className="col-12">
                        <Card className="bg-dark text-white" style={{ borderRadius: '6px' }}>
                          <Card.Header className="d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #444' }}>
                            <h4 className="card-title text-white mb-0">{t("KYC Upload Summary")}</h4>
                            <div style={{ width: '250px' }}>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  placeholder={t("Search")}
                                  value={searchTerm}
                                  onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentKycPage(1); // Reset to first page when searching
                                  }}
                                  className="bg-dark text-white"
                                  style={{ 
                                    border: '1px solid #555',
                                    borderRadius: '5px',
                                    height: '40px'
                                  }}
                                />
                              </InputGroup>
                            </div>
                          </Card.Header>
                          <Card.Body className="p-0">
                            {kycLoading ? (
                              <div className="text-center p-4">
                                <div className="spinner-border text-info" role="status">
                                  <span className="visually-hidden">{t("Loading...")}</span>
                                </div>
                                <p className="mt-2">{t("Loading KYC summary data...")}</p>
                              </div>
                            ) : (
                              <div style={{ overflowX: 'auto' }}>
                                {filteredCompanies().length > 0 ? (
                                  <>
                                    <table className="table table-dark table-bordered mb-0">
                                      <thead>
                                        <tr>
                                          <th style={{ 
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 2,
                                            width: '250px', 
                                            backgroundColor: '#37a3d3', 
                                            padding: '15px',
                                            color: 'white',
                                            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)'
                                          }}>
                                            {t("Supplier")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Basic Info")}
                                            <div className="small">
                                              {t("(Company Name, Address, Reg Num, Company Country)")}
                                            </div>
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("KYC Signed Form")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Certificate of Incorporation")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Certificate of conformity")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Tax Register")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Organigramme")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            borderRight: '1px solid #444',
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Document")}
                                          </th>
                                          <th style={{ 
                                            backgroundColor: '#37a3d3', 
                                            padding: '15px',
                                            color: 'white',
                                            textAlign: 'center',
                                            minWidth: '150px'
                                          }}>
                                            {t("Completion")}
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {getPaginatedCompanies().map(([companyName, data], index) => (
                                          <tr key={companyName} className={index % 2 === 0 ? 'bg-dark' : ''}>
                                            <td style={{ 
                                              position: 'sticky',
                                              left: 0,
                                              zIndex: 1,
                                              padding: '15px', 
                                              fontWeight: 'bold',
                                              backgroundColor: index % 2 === 0 ? '#222' : '#2a2a2a',
                                              borderRight: '2px solid #37a3d3',
                                              boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)'
                                            }}>
                                              {companyName}
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data.basicInfo} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["KYC"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["Certificate of Incorporation"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["Certificate of conformity"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["Tax Register"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["Organigramme"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              borderRight: '1px solid #444',
                                              textAlign: 'center'
                                            }}>
                                              <YesNoButton value={data["Document"]} />
                                            </td>
                                            <td style={{ 
                                              padding: '10px', 
                                              textAlign: 'center',
                                              verticalAlign: 'middle'
                                            }}>
                                              <ProgressBar percentage={data.progress} />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                    
                                    {/* Pagination controls */}
                                    <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 p-3 bg-dark">
                                      <div className="dataTables_info text-white">
                                        {t("Showing")} {(currentKycPage - 1) * kycItemsPerPage + 1} {t("To")}{" "}
                                        {Math.min(currentKycPage * kycItemsPerPage, filteredCompanies().length)} {t("Of")}{" "}
                                        {filteredCompanies().length} {t("Entries")}
                                      </div>
                                      <div className="dataTables_paginate paging_simple_numbers">
                                        <button
                                            className={`btn ${currentKycPage === 1 ? 'btn-secondary' : 'btn-primary'}`}
                                            style={{
                                            minWidth: '120px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            padding: '8px 12px',
                                            marginRight: '10px'
                                            }}
                                            onClick={() => handleKycPageChange(currentKycPage - 1)}
                                            disabled={currentKycPage === 1}
                                        >
                                            {t("Previous")}
                                        </button>
                                        <span className="mx-2 text-white">
                                            {currentKycPage} / {totalKycPages()}
                                        </span>
                                        <button
                                            className={`btn ${currentKycPage === totalKycPages() ? 'btn-secondary' : 'btn-primary'}`}
                                            style={{
                                            minWidth: '120px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            padding: '8px 12px',
                                            marginLeft: '10px'
                                            }}
                                            onClick={() => handleKycPageChange(currentKycPage + 1)}
                                            disabled={currentKycPage === totalKycPages()}
                                        >
                                            {t("Next")}
                                        </button>
                                        </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center p-4">
                                    <p>
                                      {searchTerm 
                                        ? t("No companies found matching your search")
                                        : t("No KYC data available for the selected country")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    </div>
                  ) : null}
            </div>
        </>
    );
};


export default Reports;
