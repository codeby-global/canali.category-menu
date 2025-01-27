import React, { useState, Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { useRuntime, Link } from 'vtex.render-runtime'
import { IconMinus, IconPlus, IconCaret } from 'vtex.store-icons'

import styles from '../categoryMenu.css'

const SideBarItem = ({
  treeLevel = 1,
  item: { children },
  showSubcategories,
  onClose,
  linkValues,
  item,
}) => {
  const runtime = useRuntime()
  const { route } = runtime
  const [open, setOpen] = useState(false)

  const [department, category, subcategory] = linkValues
  const params = { department }

  if (category) params.category = category
  if (subcategory) params.subcategory = subcategory

  const subCategoriesVisible =
    showSubcategories && children && children.length > 0 && treeLevel <= 1
  const isSelected = useMemo(() => {
    return route.canonicalPath.includes(item.slug)
  }, [route, item])
    const navigateToPage = () => {

    const page = category
      ? subcategory
        ? 'store.search#subcategory'
        : 'store.search#category'
      : 'store.search#department'

    console.log({page,
      params,})

    runtime.navigate({
      page,
      params,
      fallbackToWindowLocation: false,
    })
    onClose()
  }

  const handleItemClick = () => {
    if (subCategoriesVisible) {
      setOpen(prevOpen => !prevOpen)
    } else {
      navigateToPage()
    }
  }

  const sideBarContainerClasses = classNames(
    styles.sidebarItemContainer,
    'flex justify-between items-center pa5 pointer list ma0',
    isSelected ? styles.isSelected : null,
    treeLevel === 1 ? styles.isTitle : null
  )
  const sideBarItemTitleClasses = classNames(styles.sidebarItemTitle, {
    'lh-solid': treeLevel === 1,
    't-body':  treeLevel === 1
  })

  const sideBarSpanClasses = classNames(
    treeLevel === 1 ? 'c-on-base' : 'c-muted-3'
  )

  const sideBarItemClasses = classNames(`${styles.sidebarItem} list pa0 ma0`, {
    'c-muted-2 t-body pl4': treeLevel > 1,
    'c-on-base': treeLevel === 1,
  })

  const itemViewAllClasses = classNames(
    styles.itemViewAll,
    'pa5 pointer t-body c-muted-2 ma0 list'
  )

  return (
    <ul className={sideBarItemClasses}>
      <li className={sideBarContainerClasses} onClick={handleItemClick}>
        <Link className={sideBarItemTitleClasses} to={`/${params.department}/${params.category ?? ''}`}>
          {item.name}
        </Link>
        {subCategoriesVisible && (
          <a className={sideBarSpanClasses}>
            {open ? <IconCaret orientation="up" size={10} /> : <IconCaret orientation="down" size={10} />}
          </a>
        )}
      </li>
      {subCategoriesVisible && open && (
        <>
          <li
            className={itemViewAllClasses}
            onClick={navigateToPage}
          >
            <FormattedMessage id="store/category-menu.all-category.title">
              {txt => <span className="pl4">{txt}</span>}
            </FormattedMessage>
          </li>
          {children.map(child => {
            //console.log("child: ", child, treeLevel)
            if(treeLevel > 1) return
            return (
              <li key={child.id} className="list ma0 pa0">
                <SideBarItem
                  showSubcategories={showSubcategories}
                  item={child}
                  linkValues={[...linkValues, child.slug]}
                  onClose={onClose}
                  treeLevel={treeLevel + 1}
                  runtime={runtime}
                />
              </li>
            )
          })}
        </>
      )}
    </ul>
  )
}

SideBarItem.propTypes = {
  /** Sidebar's item. */
  item: PropTypes.object.isRequired,
  /** Link values to create the redirect. */
  linkValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Closes sidebar. */
  onClose: PropTypes.func.isRequired,
  /** Runtime context. */
  runtime: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  /** Tree level. */
  treeLevel: PropTypes.number,
  /** Whether to show subcategories or not */
  showSubcategories: PropTypes.bool,
}

export default SideBarItem
