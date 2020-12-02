package com.khalid7487.ecommerce.config;

import com.khalid7487.ecommerce.entity.Country;
import com.khalid7487.ecommerce.entity.Product;
import com.khalid7487.ecommerce.entity.ProductCategory;
import com.khalid7487.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager=theEntityManager;
    }


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        HttpMethod[] theUnsupportedAction={HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};
        //disable HTTP methods for product: put,post,Delete
        disableHttpMethods(Product.class,config, theUnsupportedAction);
        //disable HTTP methods for product_category: put,post,Delete
        disableHttpMethods(ProductCategory.class,config, theUnsupportedAction);
        disableHttpMethods(Country.class,config, theUnsupportedAction);
        disableHttpMethods(State.class,config, theUnsupportedAction);

        //call an internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class theclass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedAction) {
        config.getExposureConfiguration()
                .forDomainType(theclass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity ids
        //

        //-get a list of all entity classes form the entity manager
        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();

        //-create an array of the entity types
        List<Class> entityClasses= new ArrayList<>();

        //-get the entity types for the entities
        for(EntityType tempEntityType : entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        //- expose the entity ids for the array of entity/domain types
        Class[] domainTypes=entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);

    }
}
