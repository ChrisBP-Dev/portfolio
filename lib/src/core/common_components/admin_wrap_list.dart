import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/admin_page_container.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/business_information.dart';

class AdminWrapList extends StatelessWidget {
  const AdminWrapList({
    required this.listWidget,
    required this.onCreateTap,
    required this.title,
    super.key,
  });

  final Widget listWidget;
  final String title;
  final void Function() onCreateTap;

  @override
  Widget build(BuildContext context) {
    return AdminPageContainer(
      page: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            collapsedHeight: 60,
            leading: const SizedBox(),
            actions: [
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  backgroundColor: BusinessInformation.secondaryDarkColor,
                ),
                onPressed: onCreateTap,
                child: Text(title),
              ),
              gapW20,
            ],
          ),
          SliverList(
            delegate: SliverChildListDelegate.fixed([
              gapH20,
              listWidget,
              gapH39,
            ]),
          ),
        ],
      ),
    );
  }
}
